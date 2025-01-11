import { EVENT_TYPE, IProduct, IProductDelete, IProductOms } from "../types/product";
import { SHOP_TYPE, IAddress } from "../types/product";
import { ShopifyUrlInstance } from "../types/shopify";
export default class ProductService {
    static shopType: SHOP_TYPE;
    /**
     * Used to extract Product Data from shopify webhook
     * @param{IRequest} req
     * @param{string} productId
     * @param{EVENT_TYPE} eventType
     * @return{IProduct}
     */
    static extractProductDataForIngress(req: any, productId: string, eventType: EVENT_TYPE, productData?: any): IProduct[] | IProductDelete;
    /**
     *
     * Used to extract Product Data from shopify webhook which is used in ingress and need to move from local shopify service to public repo
     * @param{string} companyId (Login use company Id)
     * @param{EVENT_TYPE} productData (All ProductData array from shopify Products List)
     * @return{IProduct}
     *
     */
    static extractProductData(companyId: string, productData: any): IProductOms[];
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
    static getOrderDetail(shopifyInstance: ShopifyUrlInstance, orderId: number): Promise<{
        gateway: any;
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
    }>;
    /**
     * Extract useful info from the address
     * @param addressObject
     * @param customerDetails
     * @return {IAddress}
     */
    static getAddress(addressObject: any, customerDetails: any): IAddress;
}
