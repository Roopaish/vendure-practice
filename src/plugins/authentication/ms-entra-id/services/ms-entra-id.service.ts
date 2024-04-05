import { ConfidentialClientApplication } from "@azure/msal-node";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MSEntraIDService {
  private client: ConfidentialClientApplication;
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

  async getAuthCodeUrl(redirectURI?: string) {
    return this.client.getAuthCodeUrl({
      redirectUri: redirectURI ? redirectURI : this.redirectURI,
      scopes: ["openid profile email User.Read"],
    });
  }
}
