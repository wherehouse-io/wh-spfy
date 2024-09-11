import axios from "axios";
import { logger } from "../logger";
import Shopify, { IFulfillment, IOrderFulfillment } from "shopify-api-node";
import {
  IHSNResponse,
  IHSNVariant,
  ShopifyUrlInstance,
  SHOP_TYPE,
} from "../types/shopify";
import {
  asyncDelay,
  getShopifyBaseUrl,
  getShopifyOauthBaseUrl,
} from "../helpers";

export default class ShopifyService {
  // maintain a local cache for shop api keys, password etc.
  // will be refreshed every week
  private static shopifyCredsCache = {};

  static cleanCache() {
    for (const prop of Object.getOwnPropertyNames(this.shopifyCredsCache)) {
      delete this.shopifyCredsCache[prop];
    }
  }

  static cleanShopUrl(shopURL: string): string {
    // remove preceding https://
    if (String(shopURL).includes("https://")) {
      shopURL = shopURL.split("https://")[1];
    }

    if (String(shopURL).includes("http://")) {
      shopURL = shopURL.split("http://")[1];
    }

    // remove succeeding slashes
    if (shopURL[shopURL.length - 1] === "/") {
      shopURL = shopURL.split("/")[0];
    }

    return shopURL;
  }

  static async getShopifyUrlInstance(
    userId: string
  ): Promise<ShopifyUrlInstance> {
    try {
      const shopType = SHOP_TYPE.SHOPIFY;
      let shopCredentials;

      // check cache for shop credentials
      if (
        this.shopifyCredsCache[userId] &&
        this.shopifyCredsCache[userId][shopType]
      ) {
        shopCredentials = this.shopifyCredsCache[userId][shopType];
      } else {
        // call profile api to fetch shopify creds
        const { UMS_AUTH_URL, UMS_AUTH_PARAM } = process.env;
        const url = `${UMS_AUTH_URL}/ums/s2s/store-credentials?userId=${userId}&shopType=${shopType}`;

        logger.info(`s2s call: [${url}]`);

        const {
          data: { responseBody },
        } = await axios({
          method: "GET",
          url,
          headers: {
            Authorization: UMS_AUTH_PARAM || "",
          },
        });

        shopCredentials = responseBody;

        // insert into cache
        if (!this.shopifyCredsCache[userId]) {
          this.shopifyCredsCache[userId] = {};
        }

        this.shopifyCredsCache[userId][shopType] = shopCredentials;
      }

      const { shop, key: apiKey, secret: password } = shopCredentials;
      const shopName = this.cleanShopUrl(shop);

      return {
        shopName,
        apiKey,
        password,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  static async getShopifyInstance(userId: string): Promise<Shopify> {
    const shopType = "shopify";
    const UMS_AUTH_URL = process.env.UMS_AUTH_URL;
    const UMS_AUTH_PARAM = process.env.UMS_AUTH_PARAM;
    let shopCredentials;

    // check cache for shop credentials
    if (
      this.shopifyCredsCache[userId] &&
      this.shopifyCredsCache[userId][shopType]
    ) {
      shopCredentials = this.shopifyCredsCache[userId][shopType];
    } else {
      // call profile api to fetch shopify creds
      const url = `${UMS_AUTH_URL}/ums/s2s/store-credentials?userId=${userId}&shopType=${shopType}`;

      logger.info(`s2s call: [${url}]`);

      const {
        data: { responseBody },
      } = await axios({
        method: "GET",
        url,
        headers: {
          Authorization: UMS_AUTH_PARAM || "",
        },
      });

      shopCredentials = responseBody;

      // insert into cache
      if (!this.shopifyCredsCache[userId]) {
        this.shopifyCredsCache[userId] = {};
      }

      this.shopifyCredsCache[userId][shopType] = shopCredentials;
    }

    const { shop, key: apiKey, secret: password } = shopCredentials;
    const shopName = this.cleanShopUrl(shop);

    return new Shopify({
      shopName,
      apiKey,
      password,
    });
  }

  /**
   * @param {string | number} warehousZip Pincode of wareouse whose location is required
   * @param {*} shopifyRef
   */
  static async getLocationIdFromShopify(
    warehousZip: string | number | null,
    shopifyRef: ShopifyUrlInstance
  ): Promise<number> {
    try {
      // find out active shopify locations
      const allLocations = await this.getLocationList(shopifyRef);
      const activeLocations = allLocations.filter((l) => l.active && l.zip);

      if (activeLocations.length === 0) {
        throw new Error(
          "[Error fetch shopify locations]: No location exists in shopify, please create atleast one location to fulfill the orders"
        );
      }

      // if zip matches return location of warehouse
      // else return id of the first warehouse
      console.log("!!!!activeLocations!!!!", activeLocations);
      const matchedLocation = activeLocations.find(
        (loc) => loc.zip === String(warehousZip)
      );

      // hack: take last location or the first one - do you beauti has stock present in last one only
      return matchedLocation
        ? matchedLocation.id
        : activeLocations[activeLocations.length - 1]?.id ||
            activeLocations[0]?.id;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  static async getLocationList(shopifyRef: ShopifyUrlInstance) {
    return this.getLocationData(shopifyRef);
  }

  /**
   * @description function to cancel order on shopify
   * NOTE: Orders that are paid and have fulfillments can't be canceled on Shopify.
   * @param orderData
   * @param userId
   */
  static async cancelOrderOnShopify(externalOrderId: string, userId: string) {
    try {
      logger.info(
        `Getting shopify instance for cancelling order on Shopify for userId: ${userId}`
      );
      const shopify = await this.getShopifyUrlInstance(userId);

      logger.info(`Order External OrderId: ${externalOrderId}`);

      let isCancelled;

      if (externalOrderId) {
        isCancelled = await this.cancelOrder(shopify, externalOrderId);
        logger.info(`Is cancelled on shopify: ${JSON.stringify(isCancelled)}`);
      }

      return isCancelled;
    } catch (error: Error | any) {
      logger.error(error);
    }
  }

  static async cancelOrder(
    shopify: ShopifyUrlInstance,
    externalOrderId: string
  ) {
    return this.cancelOrderApi(shopify, externalOrderId);
  }

  /**
   * @description function to cancel order fulfillment on shopify
   * @param orderData
   * @param userId
   */
  static async cancelOrderFulfillment(externalOrderId: string, userId: string) {
    try {
      logger.info(
        `Getting shopify instance for cancelling order fulfillment on Shopify for userId: ${userId}`
      );

      if (!externalOrderId) {
        logger.info(
          `!!!!!!!External Order Id is not provided!!!!!!! ${JSON.stringify(
            externalOrderId,
            null,
            2
          )}`
        );
        return;
      }

      const shopify = await this.getShopifyUrlInstance(userId);
      logger.info(`Shopify instance: ${JSON.stringify(shopify, null, 2)}`);

      const wherehouseFulfillment = await this.getWherehouseFulfillment(
        shopify,
        externalOrderId
      );

      logger.info(
        `Wherehouse Fulfillment: ${JSON.stringify(
          wherehouseFulfillment,
          null,
          2
        )}`
      );

      let isFulfillmentCancelled: IFulfillment | false = false;
      if (wherehouseFulfillment) {
        isFulfillmentCancelled = await this.cancelFulfillment(
          shopify,
          externalOrderId,
          wherehouseFulfillment
        );
        logger.info(
          `Fulfillment cancellation response: ${JSON.stringify(
            isFulfillmentCancelled,
            null,
            2
          )}`
        );
      }

      return isFulfillmentCancelled;
    } catch (error: Error | any) {
      logger.error(error);
    }
  }

  static async getWherehouseFulfillment(
    shopify: ShopifyUrlInstance,
    externalOrderId: string
  ) {
    const shopifyOrderData = await this.getOrderData(shopify, externalOrderId);

    const wherehouseFulfillment = shopifyOrderData.fulfillments.filter(
      (fulfillment) => fulfillment.tracking_company === "Wherehouse"
    )[0];

    return wherehouseFulfillment;
  }

  static async cancelFulfillment(
    shopify: ShopifyUrlInstance,
    externalOrderId: string,
    wherehouseFulfillment: IOrderFulfillment
  ) {
    return this.cancelFulfillmentApi(
      shopify,
      externalOrderId,
      wherehouseFulfillment
    );
  }

  /**
   * @description function to mark cod order as prepaid on shopify when cod order gets delivered
   * @param orderData
   * @param userId
   */
  static async markCODOrderAsPaid(externalOrderId: string, userId: string) {
    try {
      const shopify = await this.getShopifyUrlInstance(userId);

      const createdTransactions = await this.createTransactionAtShopify(
        shopify,
        externalOrderId
      );

      if (createdTransactions[`errors`]) {
        throw new Error(JSON.stringify(createdTransactions[`errors`], null, 2));
      }

      return createdTransactions;
    } catch (error: any) {
      logger.error(error);
    }
  }

  /**
   * figures out hsn code corresponding to variants of different shopify products
   * @param userId company id
   * @param productIds product ids as an array of numbers
   * @param limitOnError flag to decide whether to throw error or send whatever data collected so far
   * @returns array of object containing product id and variants array containing with id and hsn
   */
  static async getVariantHSNCodes(
    userId: string,
    productIds: number[],
    limitOnError: boolean = false
  ): Promise<IHSNResponse[]> {
    try {
      const shopifyUrlInstance = await this.getShopifyUrlInstance(userId);

      const hsnData: IHSNResponse[] = [];

      for (const productId of productIds) {
        const { variants } = await this.getProductData(
          shopifyUrlInstance,
          String(productId),
          "variants"
        );

        const responseVariants: IHSNVariant[] = [];

        // since large number of variant causes excessive API calls to Shopify, eventually surpassing 2 req/s limit;
        // we are Avoiding hsn assignment to products having variant more than a specified limit
        const MAX_ALLOWED_SHOPIFY_VARIANT = 3;
        if (variants.length > MAX_ALLOWED_SHOPIFY_VARIANT) {
          continue;
        }

        for (const variant of variants) {
          logger.info(`delay invoked for ${variant.id}`);
          await asyncDelay(500); // delay for half second to avoid 429(too many request) error from Shopify.
          logger.info(`delay finished for ${variant.id}`);

          const { inventory_item_id } = variant;
          try {
            try {
              const { harmonized_system_code } =
                await this.getInventoryItemData(
                  shopifyUrlInstance,
                  String(inventory_item_id)
                );

              responseVariants.push({
                id: String(variant.id),
                hsn: harmonized_system_code
                  ? String(harmonized_system_code)
                  : "", // do not parse directy with String(), null also gets strigified :X
              });
              logger.info(
                `HSN - ${productId} - ${variant.id} - ${harmonized_system_code}`
              );
            } catch (error) {
              logger.error(
                `Error while getting HSN: ${JSON.stringify(error, null, 2)}`
              );
            }
          } catch (err) {
            logger.error(err);
            logger.info(`limiting to ${hsnData.length} for user id: ${userId}`);

            if (limitOnError) {
              return hsnData;
            }

            throw err;
          }
        }

        hsnData.push({
          productId: String(productId),
          variants: responseVariants,
        });
      }

      return hsnData;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  static async cancelFulfillmentApi(
    shopify: ShopifyUrlInstance,
    externalOrderId: string,
    wherehouseFulfillment: IOrderFulfillment
  ) {
    try {
      // return shopify.fulfillment.cancel(
      //   Number(externalOrderId),
      //   wherehouseFulfillment.id
      // );

      // According to older version
      // const url = `${getShopifyBaseUrl(
      //   shopify
      // )}/orders/${externalOrderId}/fulfillments/${
      //   wherehouseFulfillment.id
      // }/cancel.json`;

      const url = `${getShopifyBaseUrl(shopify, "2023-04")}/fulfillments/${
        wherehouseFulfillment.id
      }/cancel.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "POST",
        url,
        data: JSON.stringify({}),
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.fulfillment;
    } catch (e) {
      throw e;
    }
  }

  static async getOrderData(
    shopify: ShopifyUrlInstance,
    externalOrderId: string
  ) {
    try {
      // const shopifyOrderData = await shopify.order.get(Number(externalOrderId));

      const url = `${getShopifyBaseUrl(
        shopify,
        "2023-04"
      )}/orders/${externalOrderId}.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": " application/json",
        },
      });

      return {
        ...data.order,
        gateway:
          data.order.payment_gateway_names &&
          data.order.payment_gateway_names.length > 0
            ? data.order.payment_gateway_names[0]
            : "",
      };
    } catch (e) {
      throw e;
    }
  }

  static async getLocationData(shopify: ShopifyUrlInstance) {
    try {
      // return shopifyRef.location.list();

      const url = `${getShopifyBaseUrl(shopify, "2023-04")}/locations.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.locations;
    } catch (e) {
      throw e;
    }
  }

  static async cancelOrderApi(
    shopify: ShopifyUrlInstance,
    externalOrderId: string
  ) {
    try {
      // return shopify.order.cancel(Number(externalOrderId));

      const url = `${getShopifyBaseUrl(
        shopify,
        "2023-04"
      )}/orders/${externalOrderId}/cancel.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "POST",
        url,
        data: JSON.stringify({}),
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.order;
    } catch (e) {
      throw e;
    }
  }

  static async getAllProductList(
    shopify: ShopifyUrlInstance,
    limitNumber: number,
    productIds?: string
  ) {
    try {
      // const { variants } = await shopify.product.get(Number(productId));

      // let url='';
      // if (productIds) {
      //   url = `${getShopifyBaseUrl(
      //     shopify,
      //     "2024-01"
      //   )}/products.json?ids=${productIds}&limit=${limitNumber}`;
      // } else {
      //   url = `${getShopifyBaseUrl(
      //     shopify,
      //     "2023-04"
      //   )}/products.json?limit=${limitNumber}`;
      // }
      const baseUrl: string = getShopifyBaseUrl(shopify, "2023-04");
      const url = `${baseUrl}/products.json?limit=${limitNumber}${
        productIds ? `&ids=${productIds}` : ""
      }`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.products;
    } catch (e) {
      throw e;
    }
  }

  static async getProductData(
    shopify: ShopifyUrlInstance,
    productId: string,
    fields?: string
  ) {
    try {
      // const { variants } = await shopify.product.get(Number(productId));

      const url = `${getShopifyBaseUrl(
        shopify,
        "2023-04"
      )}/products/${productId}.json${fields ? `?fields=${fields}` : ""}`;

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.product;
    } catch (e) {
      throw e;
    }
  }

  static async getInventoryItemData(
    shopify: ShopifyUrlInstance,
    inventoryItemId: string
  ) {
    try {
      // const { harmonized_system_code } =
      //   await shopify.inventoryItem.get(inventory_item_id);

      const url = `${getShopifyBaseUrl(
        shopify,
        "2023-04"
      )}/inventory_items/${inventoryItemId}.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.inventory_item;
    } catch (e) {
      throw e;
    }
  }

  static async getAccessScopeData(shopify: ShopifyUrlInstance) {
    try {
      const url = `${getShopifyOauthBaseUrl(shopify)}/access_scopes.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.access_scopes;
    } catch (e) {
      throw e;
    }
  }

  // static async createTransactionAtShopify(
  //   shopify: Shopify,
  //   externalOrderId: string
  // ) {
  //   return shopify.transaction.create(Number(externalOrderId), {
  //     source: "external",
  //     kind: "capture",
  //   });
  // }

  static async createTransactionAtShopify(
    shopify: ShopifyUrlInstance,
    externalOrderId: string
  ) {
    try {
      // const createdTransactions = await this.createTransactionAtShopify(
      //   shopify,
      //   externalOrderId
      // );

      //TODO: Need to update version and check payload
      const url = `${getShopifyBaseUrl(
        shopify,
        "2023-10"
      )}/orders/${externalOrderId}/transactions.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "POST",
        url,
        data: JSON.stringify({
          transaction: {
            source: "external",
            kind: "capture",
          },
        }),
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.transaction;
    } catch (e) {
      throw e;
    }
  }

  static async inventoryUpdateAtShopifyForRTO(
    shopify: ShopifyUrlInstance,
    inventoryUpdateObject: any
  ) {
    try {
      const url = `${getShopifyBaseUrl(
        shopify,
        "2024-01"
      )}/inventory_levels/adjust.json`;

      logger.info(`Shopify call: [${url}]`);
      logger.info(
        `inventory udpate object: ${JSON.stringify(inventoryUpdateObject)}`
      );

      const { data } = await axios({
        method: "POST",
        url,
        data: JSON.stringify(inventoryUpdateObject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.inventory_level;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
}
// clean credentials cache after 7 days
setTimeout(async () => {
  try {
    ShopifyService.cleanCache();
  } catch (err) {
    logger.error(err);
  }
}, 7 * 24 * 60 * 60);
