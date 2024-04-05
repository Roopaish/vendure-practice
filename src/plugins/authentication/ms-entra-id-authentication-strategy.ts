import { ConfidentialClientApplication } from "@azure/msal-node";
import {
  AuthenticationStrategy,
  ExternalAuthenticationService,
  Injector,
  RequestContext,
  User,
} from "@vendure/core";
import { DocumentNode } from "graphql";
import gql from "graphql-tag";

export type AzureADAuthData = {
  accessToken: string;
};

export class AzureADAuthenticationStrategy
  implements AuthenticationStrategy<AzureADAuthData>
{
  readonly name = "azureAD";
  private client: ConfidentialClientApplication;
  private externalAuthenticationService: ExternalAuthenticationService;
  private clientId = process.env.AZURE_AD_CLIENTID;
  private tenantId = process.env.AZURE_AD_TENANTID;
  private clientSecret = process.env.AZURE_AD_CLIENT_SECRET;

  constructor() {
    this.client = new ConfidentialClientApplication({
      auth: {
        clientId: this.clientId,
        authority: `https://login.microsoftonline.com/${this.tenantId}`,
        clientSecret: this.clientSecret,
      },
    });
  }

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(
      ExternalAuthenticationService
    );
  }

  defineInputType(): DocumentNode {
    return gql`
      input AzureADAuthInput {
        accessToken: String!
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: AzureADAuthData
  ): Promise<User | false> {
    try {
      const accessToken = data.accessToken;

      const tokenResult = await this.client.acquireTokenByClientCredential({
        scopes: ["https://graph.microsoft.com/.default"],
      });

      if (!tokenResult || !tokenResult.accessToken) {
        console.error("Error validating access token");
        return false;
      }

      const userDetails = await this.getUserDetailsFromGraphAPI(accessToken);

      const user = await this.externalAuthenticationService.findCustomerUser(
        ctx,
        this.name,
        userDetails.id
      );

      if (user) {
        return user;
      }

      return this.externalAuthenticationService.createCustomerAndUser(ctx, {
        strategy: this.name,
        externalIdentifier: userDetails.id,
        verified: true,
        emailAddress: userDetails.email,
        firstName: userDetails.given_name,
        lastName: userDetails.family_name,
      });
    } catch (error) {
      console.error("Error authenticating with Azure AD:", error);
      return false;
    }
  }

  private async getUserDetailsFromGraphAPI(accessToken: string): Promise<any> {
    const graphApiEndpoint = "https://graph.microsoft.com/v1.0/me";

    const response = await fetch(graphApiEndpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Error calling Microsoft Graph API:", response.statusText);
      throw new Error("Error calling Microsoft Graph API");
    }

    return await response.json();
  }
}
