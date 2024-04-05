import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { shopApiExtensions } from "./api/api-extensions";
import { MSEntraIDResolver } from "./api/ms-entra-id.resolver";
import { MSEntraIDService } from "./services/ms-entra-id.service";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [MSEntraIDService],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [MSEntraIDResolver],
  },
  compatibility: "^2.0.0",
})
export class EntraIDPlugin {}
