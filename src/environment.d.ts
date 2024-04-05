export {};

// Here we declare the members of the process.env object, so that we
// can use them in our application code in a type-safe manner.
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: string;
      COOKIE_SECRET: string;
      SUPERADMIN_USERNAME: string;
      SUPERADMIN_PASSWORD: string;
      GOOGLE_CLIENT_ID: string;
      AZURE_AD_AUDIENCE: string;
      AZURE_AD_CLIENTID: string;
      AZURE_AD_TENANTID: string;
      AZURE_AD_CLIENT_SECRET: string;
    }
  }
}
