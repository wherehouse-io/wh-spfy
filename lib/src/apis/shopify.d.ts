import Shopify, { IOrderFulfillment } from "shopify-api-node";
import { IHSNResponse, ShopifyUrlInstance } from "../types/shopify";
export default class ShopifyService {
    private static shopifyCredsCache;
    static cleanCache(): void;
    static cleanShopUrl(shopURL: string): string;
    static getShopifyUrlInstance(userId: string): Promise<ShopifyUrlInstance>;
    static getShopifyInstance(userId: string): Promise<Shopify>;
    /**
     * @param {string | number} warehousZip Pincode of wareouse whose location is required
     * @param {*} shopifyRef
     */
    static getLocationIdFromShopify(warehousZip: string | number | null, shopifyRef: ShopifyUrlInstance): Promise<number>;
    static getLocationList(shopifyRef: ShopifyUrlInstance): Promise<any>;
    /**
     * @description function to cancel order on shopify
     * NOTE: Orders that are paid and have fulfillments can't be canceled on Shopify.
     * @param orderData
     * @param userId
     */
    static cancelOrderOnShopify(externalOrderId: string, userId: string): Promise<any>;
    static cancelOrder(shopify: ShopifyUrlInstance, externalOrderId: string): Promise<any>;
    /**
     * @description function to cancel order fulfillment on shopify
     * @param orderData
     * @param userId
     */
    static cancelOrderFulfillment(externalOrderId: string, userId: string): Promise<false | Shopify.IFulfillment | undefined>;
    static getWherehouseFulfillment(shopify: ShopifyUrlInstance, externalOrderId: string): Promise<any>;
    static cancelFulfillment(shopify: ShopifyUrlInstance, externalOrderId: string, wherehouseFulfillment: IOrderFulfillment): Promise<any>;
    /**
     * @description function to mark cod order as prepaid on shopify when cod order gets delivered
     * @param orderData
     * @param userId
     */
    static markCODOrderAsPaid(externalOrderId: string, userId: string): Promise<any>;
    /**
     * figures out hsn code corresponding to variants of different shopify products
     * @param userId company id
     * @param productIds product ids as an array of numbers
     * @param limitOnError flag to decide whether to throw error or send whatever data collected so far
     * @returns array of object containing product id and variants array containing with id and hsn
     */
    static getVariantHSNCodes(userId: string, productIds: string[], limitOnError?: boolean): Promise<IHSNResponse[]>;
    static cancelFulfillmentApi(shopify: ShopifyUrlInstance, externalOrderId: string, wherehouseFulfillment: IOrderFulfillment): Promise<any>;
    static getOrderData(shopify: ShopifyUrlInstance, externalOrderId: string): Promise<any>;
    static getLocationData(shopify: ShopifyUrlInstance): Promise<any>;
    static cancelOrderApi(shopify: ShopifyUrlInstance, externalOrderId: string): Promise<any>;
    static getAllProductList(shopify: ShopifyUrlInstance, limitNumber: number, productIds?: string): Promise<any[]>;
    static getProductData(shopify: ShopifyUrlInstance, productId: string, fields?: string): Promise<any>;
    static getInventoryItemData(shopify: ShopifyUrlInstance, inventoryItemId: string): Promise<any>;
    static getAccessScopeData(shopify: ShopifyUrlInstance): Promise<any>;
    static createTransactionAtShopify(shopify: ShopifyUrlInstance, externalOrderId: string): Promise<any>;
    static inventoryUpdateAtShopifyForRTO(shopify: ShopifyUrlInstance, inventoryUpdateObject: any): Promise<any>;
}
