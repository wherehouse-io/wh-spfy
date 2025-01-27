import { ShopifyUrlInstance } from "../types/shopify";
interface IFulfillmentDetails {
    location_id: string;
    orderId: string;
    tracking_urls: any;
    tracking_number: string;
    status: string;
    notify_customer: boolean;
    tracking_company: string;
    shouldApplyNewVersion: boolean;
}
export default class FulfillmentService {
    /**
     * @param {Object} fulfillmentDetails
     * @param shopify
     */
    static attachRequestId(requestId: any): typeof FulfillmentService;
    static createNewFulfillment(fulfillmentDetails: any, ShopifyUrlInstance: ShopifyUrlInstance): Promise<unknown>;
    /**
     * Getting fulfillment details from shopify to check whether the order is already fulfilled or not
     * @param externalOrderId
     * @param userId
     */
    static getFulfillmentDetails(externalOrderId: string, userId: string): Promise<{
        fulfilled: boolean;
        fulfilledBy?: string;
    }>;
    /**
     * to check if the order is already fulfilled in shopify before rts
     * @param order
     */
    static isAlreadyFulfilledOnShopify(externalOrderId: string, userId: string): Promise<{
        fulfilled: boolean;
        fulfilledBy?: string | undefined;
    }>;
    static getFulFillmentListDetails(shopify: ShopifyUrlInstance, externalOrderId: string): Promise<any>;
    static createFulfillmentAtShopify(shopify: ShopifyUrlInstance, externalOrderId: string, fulfillmentDetails: IFulfillmentDetails): Promise<any>;
    static createFulfillmentAtShopifyUpdatedVersion(shopify: ShopifyUrlInstance, externalOrderId: string, fulfillmentDetails: IFulfillmentDetails): Promise<any>;
}
export {};
