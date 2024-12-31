"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebhookId = exports.getCompanyId = exports.getShopifyOauthBaseUrl = exports.getShopifyBaseUrl = exports.convertShopifyWeightToGrams = exports.asyncDelay = void 0;
const shopify_1 = require("../types/shopify");
const product_1 = require("../types/product");
const product_2 = require("../constants/product");
/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
const asyncDelay = async (milliSeconds = 500) => {
    return new Promise((resolve, rej) => {
        try {
            setTimeout(() => {
                resolve(null);
            }, milliSeconds);
        }
        catch (err) {
            rej(err);
        }
    });
};
exports.asyncDelay = asyncDelay;
/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
const convertShopifyWeightToGrams = (weightUnit, weight) => {
    const shopifyWeightConvertMap = {
        [product_1.SHOPIFY_WEIGHT_UNITS.GRAMS]: 1,
        [product_1.SHOPIFY_WEIGHT_UNITS.KILOGRAMS]: 1000,
        [product_1.SHOPIFY_WEIGHT_UNITS.OUNCES]: 28.35,
        [product_1.SHOPIFY_WEIGHT_UNITS.POUNDS]: 454,
    };
    return (parseFloat(String(shopifyWeightConvertMap[weightUnit])) *
        parseFloat(String(weight)));
};
exports.convertShopifyWeightToGrams = convertShopifyWeightToGrams;
const getShopifyBaseUrl = (shopify, version) => {
    return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/${version || "2024-10"}`;
};
exports.getShopifyBaseUrl = getShopifyBaseUrl;
const getShopifyOauthBaseUrl = (shopify) => {
    return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/oauth`;
};
exports.getShopifyOauthBaseUrl = getShopifyOauthBaseUrl;
/**
 * Used to extract companyId from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
const getCompanyId = (shopType, req) => {
    return String(req.headers[product_2.ADDITIONAL_HEADER.COMPANY]);
};
exports.getCompanyId = getCompanyId;
/**
 * Used to extract Webhook Id from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
const getWebhookId = (shopType, req) => {
    let webhookId = "";
    const ShopTypeWebhookIdMap = {
        [shopify_1.SHOP_TYPE.SHOPIFY]: product_2.WEBHOOK_ID_KEY.SHOPIFY,
        [shopify_1.SHOP_TYPE.WP]: product_2.WEBHOOK_ID_KEY.WP,
        [shopify_1.SHOP_TYPE.CUSTOM]: product_2.WEBHOOK_ID_KEY.CUSTOM,
    };
    webhookId = req.headers[ShopTypeWebhookIdMap[shopType]].toString();
    return webhookId;
};
exports.getWebhookId = getWebhookId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGVscGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBaUU7QUFDakUsOENBQXdEO0FBQ3hELGtEQUF5RTtBQUV6RTs7OztHQUlHO0FBQ0ksTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixlQUF1QixHQUFHLEVBQ0gsRUFBRTtJQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2xDLElBQUk7WUFDRixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQixDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDbEI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFaVyxRQUFBLFVBQVUsY0FZckI7QUFFRjs7OztHQUlHO0FBQ0ksTUFBTSwyQkFBMkIsR0FBRyxDQUN6QyxVQUFnQyxFQUNoQyxNQUFjLEVBQ04sRUFBRTtJQUNWLE1BQU0sdUJBQXVCLEdBQUc7UUFDOUIsQ0FBQyw4QkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQy9CLENBQUMsOEJBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSTtRQUN0QyxDQUFDLDhCQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUs7UUFDcEMsQ0FBQyw4QkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHO0tBQ25DLENBQUM7SUFDRixPQUFPLENBQ0wsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztBQUNKLENBQUMsQ0FBQztBQWRXLFFBQUEsMkJBQTJCLCtCQWN0QztBQUVLLE1BQU0saUJBQWlCLEdBQUcsQ0FDL0IsT0FBMkIsRUFDM0IsT0FBZ0IsRUFDaEIsRUFBRTtJQUNGLE9BQU8sV0FBVyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQ2xELE9BQU8sQ0FBQyxRQUNWLGNBQWMsT0FBTyxJQUFJLFNBQVMsRUFBRSxDQUFDO0FBQ3ZDLENBQUMsQ0FBQztBQVBXLFFBQUEsaUJBQWlCLHFCQU81QjtBQUVLLE1BQU0sc0JBQXNCLEdBQUcsQ0FBQyxPQUEyQixFQUFFLEVBQUU7SUFDcEUsT0FBTyxXQUFXLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxjQUFjLENBQUM7QUFDekYsQ0FBQyxDQUFDO0FBRlcsUUFBQSxzQkFBc0IsMEJBRWpDO0FBRUY7Ozs7O0dBS0c7QUFDSSxNQUFNLFlBQVksR0FBRyxDQUFDLFFBQW1CLEVBQUUsR0FBUSxFQUFVLEVBQUU7SUFDcEUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQywyQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQztBQUZXLFFBQUEsWUFBWSxnQkFFdkI7QUFFRjs7Ozs7R0FLRztBQUNJLE1BQU0sWUFBWSxHQUFHLENBQUMsUUFBbUIsRUFBRSxHQUFRLEVBQVUsRUFBRTtJQUNwRSxJQUFJLFNBQVMsR0FBVyxFQUFFLENBQUM7SUFDM0IsTUFBTSxvQkFBb0IsR0FBRztRQUMzQixDQUFDLG1CQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxPQUFPO1FBQzNDLENBQUMsbUJBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSx3QkFBYyxDQUFDLEVBQUU7UUFDakMsQ0FBQyxtQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLHdCQUFjLENBQUMsTUFBTTtLQUMxQyxDQUFDO0lBQ0YsU0FBUyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuRSxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDLENBQUM7QUFUVyxRQUFBLFlBQVksZ0JBU3ZCIn0=