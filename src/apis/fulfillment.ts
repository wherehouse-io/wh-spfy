import axios from "axios";
import { logger } from "../logger";
import _ from "lodash";
import ShopifyService from "./shopify";
import { EShopifyFulfillmentStatus } from "../types/fulfillment";
import Shopify from "shopify-api-node";
import { ShopifyUrlInstance } from "../types/shopify";

export default class FulfillmentService {
  /**
   * @param {Object} fulfillmentDetails
   * @param shopify
   */
  static async createNewFulfillment(
    fulfillmentDetails: any,
    ShopifyUrlInstance: ShopifyUrlInstance
  ): Promise<unknown> {
    const orderId = _.get(fulfillmentDetails, "orderId");

    try {
      delete fulfillmentDetails.orderId;

      // refer to https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment#create-2021-01
      await this.createFulfillmentApi(
        ShopifyUrlInstance,
        orderId,
        fulfillmentDetails
      );

      return null;
    } catch (err: any) {
      logger.error(err);
      const message = _.get(err, "response.body.errors") || err.message;
      logger.error("[Failure Reason]:", JSON.stringify({ message, err }));
      err.message = message;
      throw new Error(err);
    }
  }

  /**
   * Getting fulfillment details from shopify to check whether the order is already fulfilled or not
   * @param externalOrderId
   * @param userId
   */
  static async getFulfillmentDetails(
    externalOrderId: string,
    userId: string
  ): Promise<{ fulfilled: boolean; fulfilledBy?: string }> {
    const shopify = await ShopifyService.getShopifyUrlInstance(userId);
    const existingFulfillment = await this.getFulFillmentListDetails(
      shopify,
      externalOrderId
    );

    console.log("!!!!existingFulfillment!!!!", existingFulfillment);

    if (existingFulfillment.length > 0) {
      const notCancelledFulfillment = existingFulfillment.filter(
        (fulfillment) =>
          fulfillment.status !== EShopifyFulfillmentStatus.CANCELLED
      );

      if (notCancelledFulfillment.length === 0) {
        return { fulfilled: false };
      }
      return {
        fulfilled: true,
        fulfilledBy: existingFulfillment[0].tracking_company,
      };
    }
    return { fulfilled: false };
  }

  /**
   * to check if the order is already fulfilled in shopify before rts
   * @param order
   */
  static async isAlreadyFulfilledOnShopify(
    externalOrderId: string,
    userId: string
  ) {
    try {
      const isAlreadyFulfilled = await this.getFulfillmentDetails(
        externalOrderId,
        userId
      );

      if (
        isAlreadyFulfilled.fulfilled &&
        isAlreadyFulfilled.fulfilledBy !== "Wherehouse"
      ) {
        throw new Error(
          `Order is already fulfilled on shopify by ${isAlreadyFulfilled.fulfilledBy}`
        );
      }

      if (
        isAlreadyFulfilled.fulfilled &&
        isAlreadyFulfilled.fulfilledBy === "Wherehouse"
      ) {
        logger.warn("Order is already fulfilled by Wherehouse");
      }

      return isAlreadyFulfilled;
    } catch (err) {
      logger.error(err);
      throw err;
    }
  }

  static async getFulFillmentListDetails(
    shopify: ShopifyUrlInstance,
    externalOrderId: string
  ) {
    try {
      // return shopify.fulfillment.list(Number(externalOrderId));

      const url = `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/2022-10/orders/${externalOrderId}/fulfillments.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.fulfillments;
    } catch (e) {
      throw e;
    }
  }

  static async createFulfillmentApi(
    shopify: ShopifyUrlInstance,
    externalOrderId: string,
    fulfillmentDetails: any
  ) {
    try {
      // await shopify.fulfillment.create(orderId, fulfillmentDetails);

      const url = `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/2021-01/orders/${externalOrderId}/fulfillments.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "POST",
        url,
        data: JSON.stringify({
          fulfillment: {
            location_id: fulfillmentDetails.location_id,
            tracking_urls: fulfillmentDetails.tracking_urls,
            tracking_number: fulfillmentDetails.tracking_number,
            notify_customer: fulfillmentDetails.notify_customer,
            tracking_company: fulfillmentDetails.tracking_company,
          },
        }),
        headers: {
          "Content-Type": " application/json",
        },
      });

      return data.fulfillment;
    } catch (e) {
      throw e;
    }
  }
}
