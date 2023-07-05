import { ShopifyUrlInstance, SHOP_TYPE } from "../types/shopify";
import { SHOPIFY_WEIGHT_UNITS } from "../types/product";
import { ADDITIONAL_HEADER, WEBHOOK_ID_KEY } from "../constants/product";

/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
export const asyncDelay = async (
  milliSeconds: number = 500
): Promise<null | Error> => {
  return new Promise((resolve, rej) => {
    try {
      setTimeout(() => {
        resolve(null);
      }, milliSeconds);
    } catch (err) {
      rej(err);
    }
  });
};

/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
export const convertShopifyWeightToGrams = (
  weightUnit: SHOPIFY_WEIGHT_UNITS,
  weight: number
): number => {
  const shopifyWeightConvertMap = {
    [SHOPIFY_WEIGHT_UNITS.GRAMS]: 1,
    [SHOPIFY_WEIGHT_UNITS.KILOGRAMS]: 1000,
    [SHOPIFY_WEIGHT_UNITS.OUNCES]: 28.35,
    [SHOPIFY_WEIGHT_UNITS.POUNDS]: 454,
  };
  return (
    parseFloat(String(shopifyWeightConvertMap[weightUnit])) *
    parseFloat(String(weight))
  );
};

export const getShopifyBaseUrl = (
  shopify: ShopifyUrlInstance,
  version?: string
) => {
  if (version) {
    return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/${version}`;
  }

  return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/2021-01`;
};

export const getShopifyOauthBaseUrl = (
  shopify: ShopifyUrlInstance
) => {
  return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/oauth`;
};

/**
 * Used to extract companyId from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
export const getCompanyId = (shopType: SHOP_TYPE, req: any): string => {
  return String(req.headers[ADDITIONAL_HEADER.COMPANY]);
};

/**
 * Used to extract Webhook Id from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
export const getWebhookId = (shopType: SHOP_TYPE, req: any): string => {
  let webhookId: string = "";
  const ShopTypeWebhookIdMap = {
    [SHOP_TYPE.SHOPIFY]: WEBHOOK_ID_KEY.SHOPIFY,
    [SHOP_TYPE.WP]: WEBHOOK_ID_KEY.WP,
    [SHOP_TYPE.CUSTOM]: WEBHOOK_ID_KEY.CUSTOM,
  };
  webhookId = req.headers[ShopTypeWebhookIdMap[shopType]].toString();
  return webhookId;
};
