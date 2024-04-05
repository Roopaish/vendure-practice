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
  code: string;
  redirectURI?: string;
};

export class AzureADAuthenticationStrategy
  implements AuthenticationStrategy<AzureADAuthData>
{
  readonly name = "azureAD";
  private client: ConfidentialClientApplication;
  private externalAuthenticationService: ExternalAuthenticationService;
  private clientId = process.env.AZURE_AD_CLIENT_ID;
  private tenantId = process.env.AZURE_AD_TENANT_ID;
  private clientSecret = process.env.AZURE_AD_CLIENT_SECRET;
  private redirectURI = process.env.AZURE_AD_REDIRECT_URI;

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
        code: String!
        redirectURI: String
      }
    `;
  }

  async authenticate(
    ctx: RequestContext,
    data: AzureADAuthData
  ): Promise<User | false> {
    try {
      const tokenResult = await this.client.acquireTokenByCode({
        code: data.code,
        redirectUri: data?.redirectURI ? data?.redirectURI : this.redirectURI,
        scopes: ["openid profile email User.Read"],
      });

      console.log({ tokenResult });

      if (!tokenResult || !tokenResult.accessToken) {
        console.error("Error validating access token");
        return false;
      }

      // @ts-expect-error Email comes with the idTokenClaims, but the type is not there
      const email = tokenResult.idTokenClaims?.email;
      const name = tokenResult.account?.name;
      const id = tokenResult.uniqueId;

      const user = await this.externalAuthenticationService.findCustomerUser(
        ctx,
        this.name,
        id
      );

      if (user) {
        return user;
      }

      return this.externalAuthenticationService.createCustomerAndUser(ctx, {
        strategy: this.name,
        externalIdentifier: id,
        verified: true,
        emailAddress: email,
        firstName: name,
        lastName: "",
      });
    } catch (error) {
      console.error("Error authenticating with Azure AD:", error);
      return false;
    }
  }
}
