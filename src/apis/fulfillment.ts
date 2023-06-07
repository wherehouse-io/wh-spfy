import axios from "axios";
import { logger } from "../logger";
import _ from "lodash";
import ShopifyService from "./shopify";
import { EShopifyFulfillmentStatus } from "../types/fulfillment";
import { ShopifyUrlInstance } from "../types/shopify";
import { getShopifyBaseUrl } from "../helpers";

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
  static async createNewFulfillment(
    fulfillmentDetails: any,
    ShopifyUrlInstance: ShopifyUrlInstance
  ): Promise<unknown> {
    logger.info(
      `!!!!!fulfillmentDetails!!!!! ${JSON.stringify(
        fulfillmentDetails,
        null,
        2
      )}`
    );
    const orderId = fulfillmentDetails?.orderId;
    const shouldApplyNewVersion = fulfillmentDetails?.shouldApplyNewVersion;
    logger.info(
      `!!!!!!orderId and shouldApplyNewVersion!!!!!!! ${orderId} and ${shouldApplyNewVersion}`
    );

    try {
      // delete fulfillmentDetails.orderId;

      // refer to https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment#create-2021-01

      if (!shouldApplyNewVersion) {
        logger.info(
          `!!!!!!!Fulfillment is creating using older method!!!!!!!!!`
        );
        return this.createFulfillmentAtShopify(
          ShopifyUrlInstance,
          orderId,
          fulfillmentDetails
        );
      }

      logger.info(`!!!!!!!Fulfillment is creating using newer method!!!!!!!!!`);
      return this.createFulfillmentAtShopifyUpdatedVersion(
        ShopifyUrlInstance,
        orderId,
        fulfillmentDetails
      );
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

    logger.info(`!!!!existingFulfillment!!!! ${existingFulfillment}`);

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

      const url = `${getShopifyBaseUrl(
        shopify,
        "2023-01"
      )}/orders/${externalOrderId}/fulfillments.json`;
      logger.info(`Shopify call: [${url}]`);

      const { data } = await axios({
        method: "GET",
        url,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.fulfillments;
    } catch (e) {
      throw e;
    }
  }

  static async createFulfillmentAtShopify(
    shopify: ShopifyUrlInstance,
    externalOrderId: string,
    fulfillmentDetails: IFulfillmentDetails
  ) {
    try {
      // await shopify.fulfillment.create(orderId, fulfillmentDetails);

      const url = `${getShopifyBaseUrl(
        shopify
      )}/orders/${externalOrderId}/fulfillments.json`;
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
          "Content-Type": "application/json",
        },
      });

      return data.fulfillment;
    } catch (e) {
      throw e;
    }
  }

  static async createFulfillmentAtShopifyUpdatedVersion(
    shopify: ShopifyUrlInstance,
    externalOrderId: string,
    fulfillmentDetails: IFulfillmentDetails
  ) {
    try {
      const shopifyBaseURl = getShopifyBaseUrl(shopify, "2023-04");
      // Getting Fulfillment Orders
      const fulfillmentOrdersUrl = `${shopifyBaseURl}/orders/${externalOrderId}/fulfillment_orders.json`;
      logger.info(
        `Shopify call for fulfillment orders: [${fulfillmentOrdersUrl}]`
      );
      const { data: fulfillmentOrderData } = await axios({
        method: "GET",
        url: fulfillmentOrdersUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (fulfillmentOrderData?.fulfillment_orders?.length === 0) {
        throw new Error("Fulfillment Order Is Not Found");
      }

      const updatedFulfillmentOrder: any = [];

      //check for locationId mapping
      for (const fulfillmentOrderItem of fulfillmentOrderData.fulfillment_orders) {
        logger.info(
          `!!!!!!!Started For Fulfillment Order!!!!!!!! ${fulfillmentOrderItem.id}`
        );
        const assignedLocationId = fulfillmentOrderItem.assigned_location_id;
        const wherehouseAssignedLocationId = fulfillmentDetails.location_id;
        logger.info(
          `!!!!!!!!!!!assignedLocationId and wherehouseAssignedLocationId!!!!!!!!${assignedLocationId} and ${wherehouseAssignedLocationId}`
        );

        // if shopify assigned location id and our generated location id do not match then we have to move that fulfillment order to updated location id
        if (wherehouseAssignedLocationId !== assignedLocationId) {
          //move to the our generated location id
          const moveLocationUrl = `${shopifyBaseURl}/fulfillment_orders/${fulfillmentOrderItem.id}/move.json`;
          logger.info(
            `Shopify call for move location url: [${moveLocationUrl}]`
          );

          const { data: moveLocationData } = await axios({
            method: "POST",
            url: moveLocationUrl,
            data: JSON.stringify({
              fulfillment_order: {
                new_location_id: wherehouseAssignedLocationId,
              },
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          // IF fulfillment order location is moved successFully then push it into updated fulfillment order array with updated location id
          // If this fulfillment order location is not moved then will not be pushed so fulfillment twill not be created for that order
          updatedFulfillmentOrder.push({
            ...fulfillmentOrderItem,
            assigned_location_id: !moveLocationData?.original_fulfillment_order
              ? fulfillmentOrderItem.assigned_location_id
              : wherehouseAssignedLocationId,
          });
        } else {
          updatedFulfillmentOrder.push({
            ...fulfillmentOrderItem,
          });
        }
      }

      // Create Fulfillment for each fulfillment order
      const createdFulfillmentResponse: any = [];
      for (const updatedFulfillmentOrderItem of updatedFulfillmentOrder) {
        const url = `${shopifyBaseURl}/fulfillments.json`;
        logger.info(`Shopify call create fulfillment: [${url}]`);
        const fulfillmentObject = {
          location_id: updatedFulfillmentOrderItem.assigned_location_id,
          notify_customer: fulfillmentDetails.notify_customer,
          tracking_info: {
            number: fulfillmentDetails.tracking_number,
            url: fulfillmentDetails.tracking_urls,
            company: fulfillmentDetails.tracking_company,
          },
          line_items_by_fulfillment_order: [
            {
              fulfillment_order_id: updatedFulfillmentOrderItem.id,
            },
          ],
        };

        logger.info(
          `!!!!!!!!!!fulfillmentObject!!!!!!! ${JSON.stringify(
            fulfillmentObject,
            null,
            2
          )}`
        );

        const { data } = await axios({
          method: "POST",
          url,
          data: JSON.stringify({
            fulfillment: fulfillmentObject,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        createdFulfillmentResponse.push(data);
      }

      return createdFulfillmentResponse;
    } catch (e) {
      throw e;
    }
  }
}
