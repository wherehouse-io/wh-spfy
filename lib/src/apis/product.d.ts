import { IProduct } from "../types/product";
import { IAddress } from "../types/product";
import { ShopifyUrlInstance } from "../types/shopify";
export default class ProductService {
    /**
     * Used to extract Product Data from shopify webhook
     * @param{string} companyId (Login use company Id)
     * @param{EVENT_TYPE} productData (All ProductData array from shopify Products List)
     * @return{IProduct}
     *
     */
    static extractProductData(companyId: string, productData: any): IProduct[];
    /**
     * This Function is used to get all products from shopify
     * @param shopifyInstance (Shopify config Instance)
     * @returns Shopify Products List
     *
     */
    static getProductList(shopifyInstance: ShopifyUrlInstance): Promise<any>;
    /**
     * This Function is used to get order detail from shopify
     * @param shopifyInstance (Shopify config Instance)
     * @param orderId (orderId) (External Order Id)
     *
     * @returns Shopify Order Detail
     *
     */
    static getOrderDetail(shopifyInstance: ShopifyUrlInstance, orderId: number): Promise<any>;
    /**
     * Extract useful info from the address
     * @param addressObject
     * @param customerDetails
     * @return {IAddress}
     */
    static getAddress(addressObject: any, customerDetails: any): IAddress;
}
