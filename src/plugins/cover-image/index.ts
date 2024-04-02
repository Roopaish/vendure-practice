import {
  Asset,
  LanguageCode,
  PluginCommonModule,
  VendurePlugin,
} from "@vendure/core";

@VendurePlugin({
  imports: [PluginCommonModule],
  configuration: (config) => {
    config.customFields.Customer.push({
      type: "relation",
      entity: Asset,
      name: "coverImage",
      label: [{ languageCode: LanguageCode.en, value: "Cover Image" }],
    });
    return config;
  },
})
export class CustomerCoverImage {}
