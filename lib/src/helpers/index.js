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
            const now = new Date().getTime();
            while (new Date().getTime() < now + milliSeconds) {
                /* Do nothing */
            }
            resolve(null);
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
    if (version) {
        return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/${version}`;
    }
    return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/2021-01`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGVscGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBaUU7QUFDakUsOENBQXdEO0FBQ3hELGtEQUF5RTtBQUV6RTs7OztHQUlHO0FBQ0ksTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixlQUF1QixHQUFHLEVBQ0gsRUFBRTtJQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2xDLElBQUk7WUFDRixNQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pDLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxHQUFHLEdBQUcsWUFBWSxFQUFFO2dCQUNoRCxnQkFBZ0I7YUFDakI7WUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDZjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQWRXLFFBQUEsVUFBVSxjQWNyQjtBQUVGOzs7O0dBSUc7QUFDSSxNQUFNLDJCQUEyQixHQUFHLENBQ3pDLFVBQWdDLEVBQ2hDLE1BQWMsRUFDTixFQUFFO0lBQ1YsTUFBTSx1QkFBdUIsR0FBRztRQUM5QixDQUFDLDhCQUFvQixDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDL0IsQ0FBQyw4QkFBb0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJO1FBQ3RDLENBQUMsOEJBQW9CLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSztRQUNwQyxDQUFDLDhCQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUc7S0FDbkMsQ0FBQztJQUNGLE9BQU8sQ0FDTCxVQUFVLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDdkQsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUMzQixDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBZFcsUUFBQSwyQkFBMkIsK0JBY3RDO0FBRUssTUFBTSxpQkFBaUIsR0FBRyxDQUMvQixPQUEyQixFQUMzQixPQUFnQixFQUNoQixFQUFFO0lBQ0YsSUFBSSxPQUFPLEVBQUU7UUFDWCxPQUFPLFdBQVcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLGNBQWMsT0FBTyxFQUFFLENBQUM7S0FDakc7SUFFRCxPQUFPLFdBQVcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLG9CQUFvQixDQUFDO0FBQy9GLENBQUMsQ0FBQztBQVRXLFFBQUEsaUJBQWlCLHFCQVM1QjtBQUVLLE1BQU0sc0JBQXNCLEdBQUcsQ0FDcEMsT0FBMkIsRUFDM0IsRUFBRTtJQUNGLE9BQU8sV0FBVyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsY0FBYyxDQUFDO0FBQ3pGLENBQUMsQ0FBQztBQUpXLFFBQUEsc0JBQXNCLDBCQUlqQztBQUVGOzs7OztHQUtHO0FBQ0ksTUFBTSxZQUFZLEdBQUcsQ0FBQyxRQUFtQixFQUFFLEdBQVEsRUFBVSxFQUFFO0lBQ3BFLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsMkJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUM7QUFGVyxRQUFBLFlBQVksZ0JBRXZCO0FBRUY7Ozs7O0dBS0c7QUFDSSxNQUFNLFlBQVksR0FBRyxDQUFDLFFBQW1CLEVBQUUsR0FBUSxFQUFVLEVBQUU7SUFDcEUsSUFBSSxTQUFTLEdBQVcsRUFBRSxDQUFDO0lBQzNCLE1BQU0sb0JBQW9CLEdBQUc7UUFDM0IsQ0FBQyxtQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLHdCQUFjLENBQUMsT0FBTztRQUMzQyxDQUFDLG1CQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsd0JBQWMsQ0FBQyxFQUFFO1FBQ2pDLENBQUMsbUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSx3QkFBYyxDQUFDLE1BQU07S0FDMUMsQ0FBQztJQUNGLFNBQVMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbkUsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQyxDQUFDO0FBVFcsUUFBQSxZQUFZLGdCQVN2QiJ9