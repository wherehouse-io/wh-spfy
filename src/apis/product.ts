import camelcaseKeys from "camelcase-keys";
import {
  EVENT_TYPE,
  IProduct,
  IProductDelete,
  IProductOms,
} from "../types/product";
import {
  DEFAULT_PAGINATION_LIMIT_SHOPIFY_PRODUCT_LIST,
  PRODUCT_TYPE,
  SHOPIFY_PRODUCT_STATUS,
  SHOP_TYPE,
  WEIGHT_UNIT,
  IAddress,
} from "../types/product";
import {
  convertShopifyWeightToGrams,
  getCompanyId,
  getWebhookId,
} from "../helpers";
import { ShopifyUrlInstance } from "../types/shopify";
import ShopifyService from "./shopify";

export default class ProductService {
  public static shopType: SHOP_TYPE = SHOP_TYPE.SHOPIFY;

  /**
   * Used to extract Product Data from shopify webhook
   * @param{IRequest} req
   * @param{string} productId
   * @param{EVENT_TYPE} eventType
   * @return{IProduct}
   */
  public static extractProductDataForIngress(
    req: any,
    productId: string,
    eventType: EVENT_TYPE,
    productData?: any
  ): IProduct[] | IProductDelete {
    let body: any = {};
    body = productData
      ? camelcaseKeys(productData, { deep: true })
      : camelcaseKeys(req.body, { deep: true });
    if (eventType === EVENT_TYPE.DELETE) {
      return {
        productId: body?.id?.toString(),
        eventType,
        companyId: getCompanyId(this.shopType, req),
        shopType: this.shopType,
        webhookId: getWebhookId(this.shopType, req),
      };
    }
    const products: IProduct[] = [];
    const { variants, images, title, handle, status, productType } = body;
    // TODO: add HSN code
    variants?.edges.forEach((v: any) => {
      let variantItem: IProduct;
      const variant = v.node;
      variantItem = {
        _id: productId,
        variantId: String(variant?.id) || '',
        webhookId: productData
          ? "add-script-webhook-id"
          : getWebhookId(this.shopType, req),
        eventType,
        shopType: this.shopType,
        companyId: productData
          ? productData.companyId
          : getCompanyId(this.shopType, req),
        productTitle: title || "",
        variantTitle: variant.title || "",
        category: productType || "",
        createdAt: new Date(variant.createdAt),
        updatedAt: new Date(variant.updatedAt),
        weight: convertShopifyWeightToGrams(
          variant?.inventoryItem?.measurement?.weight?.unit,
          Number(variant?.inventoryItem?.measurement?.weight?.value) || 0
        ),
        weightUnit: WEIGHT_UNIT.GRAM,
        taxable: variant.taxable,
        isActive: status === SHOPIFY_PRODUCT_STATUS.ACTIVE,
        sku: variant.sku || "",
        skuId: "",
        productId: String(variant.product.id),
        price: Number(variant.price),
        inventoryQuantity: Number(variant.inventoryQuantity) || 0,
        barcode: variant.barcode || "",
        handle,
        imageUrls: String(variant?.image?.id)
          ? images?.edges
              .filter((image) => image.node.id === String(variant?.image?.id))
              .map((o: { src: any }) => o.src)
          : [],
        productType: PRODUCT_TYPE.VARIATION,
        dimensions: {},
      };
      products.push(variantItem);
    });

    return products;
  }

  /**
   *
   * Used to extract Product Data from shopify webhook which is used in ingress and need to move from local shopify service to public repo
   * @param{string} companyId (Login use company Id)
   * @param{EVENT_TYPE} productData (All ProductData array from shopify Products List)
   * @return{IProduct}
   *
   */
  static extractProductData(
    companyId: string,
    productData: any
  ): IProductOms[] {
    let body: any = {};
    body = camelcaseKeys(productData, { deep: true });

    const products: IProductOms[] = [];
    const { variants, images, title, handle, status, productType } = body;
    // // TODO: add HSN code
    variants.forEach((variant: any) => {
      let variantItem: IProductOms;
      variantItem = {
        variantId: variant.id.toString(),
        shopType: SHOP_TYPE.SHOPIFY,
        companyId,
        productTitle: title || "",
        variantTitle: variant.title || "",
        category: productType || "",
        createdAt: new Date(variant.createdAt),
        updatedAt: new Date(variant.updatedAt),
        weight: convertShopifyWeightToGrams(
          variant.weightUnit,
          Number(variant.weight) || 0
        ),
        weightUnit: WEIGHT_UNIT.GRAM,
        taxable: variant.taxable,
        isActive: status === SHOPIFY_PRODUCT_STATUS.ACTIVE,
        sku: variant.sku || "",
        skuId: "",
        productId: variant.productId.toString(),
        price: Number(variant.price),
        inventoryQuantity: Number(variant.inventoryQuantity) || 0,
        barcode: variant.barcode || "",
        handle,
        imageUrls: variant.imageId
          ? images
              .filter((image: { id: any }) => image.id === variant.imageId)
              .map((o: { src: any }) => o.src)
          : [],
        productType: PRODUCT_TYPE.VARIATION,
        dimensions: {},
      };
      products.push(variantItem);
    });

    return products;
  }

  /**
   * This Function is used to get all products from shopify
   * @param shopifyInstance (Shopify config Instance)
   * @returns Shopify Products List
   *
   */
  static async getProductList(shopifyInstance: ShopifyUrlInstance) {
    try {
      let params = { limit: DEFAULT_PAGINATION_LIMIT_SHOPIFY_PRODUCT_LIST };
      let productLists: any = [];

      do {
        // const products = await shopifyInstance.product.list({
        //   ...params,
        //   fields: `id,variants,images,title,handle,status,productType`,
        // });
        const products: any = await ShopifyService.getAllProductList(
          shopifyInstance,
          params.limit
        );
        productLists = productLists.concat(products);

        params = products.nextPageParameters;
      } while (params !== undefined);

      return productLists;
    } catch (error) {
      throw error;
    }
  }

  /**
   * This Function is used to get order detail from shopify
   * @param shopifyInstance (Shopify config Instance)
   * @param orderId (orderId) (External Order Id)
   *
   * @returns Shopify Order Detail
   *
   */
  static async getOrderDetail(
    shopifyInstance: ShopifyUrlInstance,
    orderId: number
  ) {
    try {
      return ShopifyService.getOrderData(shopifyInstance, String(orderId));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Extract useful info from the address
   * @param addressObject
   * @param customerDetails
   * @return {IAddress}
   */
  public static getAddress(addressObject: any, customerDetails: any): IAddress {
    if (addressObject?.lastName && !addressObject?.firstName) {
      addressObject.firstName = addressObject.lastName;
      addressObject.lastName = "";
    }

    return {
      firstName: addressObject?.firstName,
      lastName: addressObject?.lastName || "",
      email: addressObject?.email || customerDetails?.email || "",
      phone: addressObject?.phone || customerDetails?.phone || "",
      address1:
        addressObject?.address1 ||
        customerDetails?.defaultAddress?.address1 ||
        "",
      address2:
        addressObject?.address2 ||
        customerDetails?.defaultAddress?.address2 ||
        "",
      city: addressObject?.city || customerDetails?.defaultAddress?.city || "",
      state:
        addressObject?.province ||
        customerDetails?.defaultAddress?.province ||
        "",
      country:
        addressObject?.country ||
        customerDetails?.defaultAddress?.country ||
        "",
      pincode: addressObject?.zip || customerDetails?.defaultAddress?.zip || "",
      company: addressObject?.company || "",
    };
  }
}
