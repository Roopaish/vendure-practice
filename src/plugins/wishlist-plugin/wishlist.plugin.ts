import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { shopApiExtensions } from "./api/api-extensions";
import { WishlistShopResolver } from "./api/wishlist.resolver";
import { WishlistItem } from "./entities/wishlist-item.entity";
import { WishlistService } from "./services/wishlist.service";
import "./types";

@VendurePlugin({
  // The PluginCommonModule will be required in all plugins that you create. It contains the common services that are exposed by Vendure Core, allowing you to inject them into your plugin's services and resolvers.
  imports: [PluginCommonModule],
  providers: [WishlistService],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [WishlistShopResolver],
  },
  compatibility: "^2.0.0",
  entities: [WishlistItem],
  configuration: (config) => {
    config.customFields.Customer.push({
      name: "wishlistItems",
      type: "relation",
      list: true,
      entity: WishlistItem,
      // Don't expose as graphql field from customer but from other we will define later on
      internal: true,
    });
    return config;
  },
})
export class WishlistPlugin {}
