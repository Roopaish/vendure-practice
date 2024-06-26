import { AdminUiPlugin } from "@vendure/admin-ui-plugin";
import { AssetServerPlugin } from "@vendure/asset-server-plugin";
import {
  Asset,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  LanguageCode,
  NativeAuthenticationStrategy,
  VendureConfig,
  dummyPaymentHandler,
} from "@vendure/core";
import { EmailPlugin, defaultEmailHandlers } from "@vendure/email-plugin";
import "dotenv/config";
import path from "path";
import { GoogleAuthenticationStrategy } from "./plugins/authentication/google-authentication-strategy";
import { AzureADAuthenticationStrategy } from "./plugins/authentication/ms-entra-id/ms-entra-id-authentication-strategy";
import { EntraIDPlugin } from "./plugins/authentication/ms-entra-id/ms-entra-id.plugin";
import { CustomerCoverImage } from "./plugins/cover-image";
import { WishlistPlugin } from "./plugins/wishlist-plugin/wishlist.plugin";

const IS_DEV = process.env.APP_ENV === "dev";

export const config: VendureConfig = {
  apiOptions: {
    port: 3000,
    adminApiPath: "admin-api",
    shopApiPath: "shop-api",
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV
      ? {
          adminApiPlayground: {
            settings: { "request.credentials": "include" },
          },
          adminApiDebug: true,
          shopApiPlayground: {
            settings: { "request.credentials": "include" },
          },
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ["bearer", "cookie"],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    shopAuthenticationStrategy: [
      new NativeAuthenticationStrategy(),
      new GoogleAuthenticationStrategy(),
      new AzureADAuthenticationStrategy(),
    ],
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions: {
    type: "better-sqlite3",
    // See the README.md "Migrations" section for an explanation of
    // the `synchronize` and `migrations` options.
    synchronize: false,
    migrations: [path.join(__dirname, "./migrations/*.+(js|ts)")],
    logging: true,
    database: path.join(__dirname, "../vendure.sqlite"),
  },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {
    Customer: [
      {
        name: "avatar",
        type: "relation",
        entity: Asset,
        label: [{ languageCode: LanguageCode.en, value: "Avatar" }],
      },
    ],
  },
  plugins: [
    AssetServerPlugin.init({
      route: "assets",
      assetUploadDir: path.join(__dirname, "../static/assets"),
      // For local dev, the correct value for assetUrlPrefix should
      // be guessed correctly, but for production it will usually need
      // to be set manually to match your production url.
      assetUrlPrefix: IS_DEV ? undefined : "https://www.my-shop.com/assets/",
    }),
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, "../static/email/test-emails"),
      route: "mailbox",
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, "../static/email/templates"),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation.
        // Here we are assuming a storefront running at http://localhost:8080.
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: "http://localhost:8080/verify",
        passwordResetUrl: "http://localhost:8080/password-reset",
        changeEmailAddressUrl:
          "http://localhost:8080/verify-email-address-change",
      },
    }),
    AdminUiPlugin.init({
      route: "admin",
      port: 3002,
      adminUiConfig: {
        apiPort: 3000,
      },
    }),
    CustomerCoverImage,
    WishlistPlugin,
    EntraIDPlugin,
  ],
};
