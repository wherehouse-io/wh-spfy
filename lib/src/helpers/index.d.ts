import { ShopifyUrlInstance, SHOP_TYPE } from "../types/shopify";
import { SHOPIFY_WEIGHT_UNITS } from "../types/product";
/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
export declare const asyncDelay: (milliSeconds?: number) => Promise<null | Error>;
/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
export declare const convertShopifyWeightToGrams: (weightUnit: SHOPIFY_WEIGHT_UNITS, weight: number) => number;
export declare const getShopifyBaseUrl: (shopify: ShopifyUrlInstance, version?: string) => string;
export declare const getShopifyOauthBaseUrl: (shopify: ShopifyUrlInstance) => string;
/**
 * Used to extract companyId from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
export declare const getCompanyId: (shopType: SHOP_TYPE, req: any) => string;
/**
 * Used to extract Webhook Id from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
export declare const getWebhookId: (shopType: SHOP_TYPE, req: any) => string;
export declare const cleanShopifyIds: (data: any) => any;
export declare const convertShopifyOrderToRestOrder: (order: any) => {
    billingAddress: any;
    shippingAddress: any;
    lineItems: any;
    taxLines: any;
    id: any;
    totalWeight: any;
    financialStatus: any;
    customer: any;
    currentTotalPrice: any;
    discountCodes: any;
    paymentGatewayNames: any;
    tags: any;
    shippingLines: any;
    taxesIncluded: any;
    fulfillments: any;
    cancelledAt: any;
    createdAt: any;
    updatedAt: any;
    name: any;
};
export declare function transformDataToProductList(data: any): any;
