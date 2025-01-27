import axios from "axios";
import { logger } from "../logger";
import _ from "lodash";
import ShopifyService from "./shopify";
import { EShopifyFulfillmentStatus } from "../types/fulfillment";
import { ShopifyUrlInstance } from "../types/shopify";
import { getShopifyBaseUrl } from "../helpers";
import {
  GET_FULFILLMENT_LIST_COUNT_QUERY,
  GET_FULFILLMENT_ORDER_QUERY,
} from "../helpers/graphql/queries";
import {
  CREATE_FULFILLMENT_MUTATION,
  FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS,
  MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION,
} from "../helpers/graphql/mutations";
import requestIdNamespace from "../utils/namespace";

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

  static attachRequestId(requestId) {
    requestIdNamespace.run(() => {
      requestIdNamespace.set("requestId", requestId);
      const reqid = requestIdNamespace.get("requestId");
      logger.info(`reqid---${JSON.stringify(reqid)}`);
    });
    return this;
  }

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
    try {
      // delete fulfillmentDetails.orderId;
      // refer to https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment#create-2021-01

      const orderId = fulfillmentDetails?.orderId;
      logger.info(`!!!!!!!Creating fulfilment!!!!!!!!!`);
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
          fulfillment.status.toLowerCase() !==
          EShopifyFulfillmentStatus.CANCELLED
      );

      if (notCancelledFulfillment.length === 0) {
        return { fulfilled: false };
      }
      return {
        fulfilled: true,
        fulfilledBy: existingFulfillment[0].trackingInfo[0].company,
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
      const url = `${getShopifyBaseUrl(shopify)}/graphql.json`;
      logger.info(`Shopify call: [${url}]`);
      const fulfillmentId = `gid://shopify/Order/${externalOrderId}`;
      const { data } = await axios({
        method: "POST",
        url,
        headers: {
          "X-Shopify-Access-Token": shopify.password,
          "Content-Type": "application/json",
        },
        data: {
          query: GET_FULFILLMENT_LIST_COUNT_QUERY,
          variables: { fulfillmentId },
        },
      });

      return data.order.fulfillments;
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

      const url = `${getShopifyBaseUrl(shopify)}/graphql.json`;
      logger.info(`Shopify call: [${url}]`);
      const id = `gid://shopify/FulfillmentOrder/${externalOrderId}`;

      const { data } = await axios({
        method: "POST",
        url,
        data: {
          query: FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS,
          variables: {
            trackingNumber: fulfillmentDetails.tracking_number,
            trackingUrls: fulfillmentDetails.tracking_urls,
            trackingCompany: fulfillmentDetails.tracking_company,
            notifyCustomer: fulfillmentDetails.notify_customer,
            fulfillmentOrderId: id,
          },
        },
        headers: {
          "X-Shopify-Access-Token": shopify.password,
          "Content-Type": "application/json",
        },
      });

      if (data.errors) {
        throw new Error(
          `GraphQL errors at fulfillment mutation with multiple tracking url: ${JSON.stringify(
            data.errors
          )}`
        );
      }

      return data.data.fulfillmentCreate.fulfillment;
    } catch (e) {
      throw e;
    }
  }

  static async createFulfillmentAtShopifyUpdatedVersion(
    shopify: ShopifyUrlInstance,
    externalOrderId: string,
    fulfillmentDetails: IFulfillmentDetails
  ) {
    const shopifyBaseURl = getShopifyBaseUrl(shopify);
    // Getting Fulfillment Orders
    const url = `${shopifyBaseURl}/graphql.json`;

    logger.info(`Shopify call for fulfillment orders: [${url}]`);
    const fulfillmentOrderId = `gid://shopify/Order/${externalOrderId}`;
    const { data: fulfillmentOrderData } = await axios({
      method: "POST",
      url: url,
      headers: {
        "X-Shopify-Access-Token": shopify.password,
        "Content-Type": "application/json",
      },
      data: {
        query: GET_FULFILLMENT_ORDER_QUERY,
        variables: { fulfillmentOrderId },
      },
    });

    logger.info(
      `response --- ${JSON.stringify(
        fulfillmentOrderData?.data?.order?.fulfillmentOrders?.nodes
      )}`
    );

    if (!fulfillmentOrderData.data?.order?.fulfillmentOrders?.nodes?.length) {
      // throw new Error("Fulfillment Order Is Not Found");
      logger.error(`Fulfillment Order Is Not Found`);
      throw new Error("Permission disabled for new fulfillment flow");
    }

    const updatedFulfillmentOrder: any = [];

    //check for locationId mapping
    for (const fulfillmentOrderItem of fulfillmentOrderData?.data?.order
      ?.fulfillmentOrders?.nodes) {
      logger.info(
        `!!!!!!!Started For Fulfillment Order!!!!!!!! ${fulfillmentOrderItem.id}`
      );

      if (fulfillmentOrderItem.status.toLowerCase() === "closed") {
        logger.warn(
          `skipping this fulfillment order(${fulfillmentOrderItem.id}) since status is closed!`
        );
        continue;
      }

      const assignedLocationId =
        fulfillmentOrderItem.assignedLocation.location.id;
      const wherehouseAssignedLocationId = fulfillmentDetails.location_id;
      logger.info(
        `!!!!!!!!!!!assignedLocationId and wherehouseAssignedLocationId!!!!!!!!${assignedLocationId} and ${wherehouseAssignedLocationId}`
      );

      // if shopify assigned location id and our generated location id do not match then we have to move that fulfillment order to updated location id
      if (wherehouseAssignedLocationId !== assignedLocationId) {
        //move to the our generated location id

        const { data: moveLocationData } = await axios({
          method: "POST",
          url: url,
          headers: {
            "X-Shopify-Access-Token": shopify.password,
            "Content-Type": "application/json",
          },
          data: {
            query: MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION,
            variables: {
              id: fulfillmentOrderItem.id,
              wherehouseAssignedLocationId,
            },
          },
        });

        if (moveLocationData.errors) {
          throw new Error(
            `GraphQL errors At move location: ${JSON.stringify(
              moveLocationData.errors
            )}`
          );
        }

        // IF fulfillment order location is moved successFully then push it into updated fulfillment order array with updated location id
        // If this fulfillment order location is not moved then will not be pushed so fulfillment twill not be created for that order
        updatedFulfillmentOrder.push({
          ...fulfillmentOrderItem,
          assigned_location_id: !moveLocationData?.data?.fulfillmentOrderMove
            ?.originalFulfillmentOrder
            ? fulfillmentOrderItem.assignedLocation.location.id
            : wherehouseAssignedLocationId,
        });
      } else {
        updatedFulfillmentOrder.push({ ...fulfillmentOrderItem });
      }
    }

    // Create Fulfillment for each fulfillment order
    const createdFulfillmentResponse: any = [];
    for (const updatedFulfillmentOrderItem of updatedFulfillmentOrder) {
      logger.info(`Shopify call create fulfillment: [${url}]`);

      const { data } = await axios({
        method: "POST",
        url,
        data: {
          query: CREATE_FULFILLMENT_MUTATION,
          variables: {
            trackingNumber: fulfillmentDetails.tracking_number,
            trackingUrl: fulfillmentDetails.tracking_urls[0],
            trackingCompany: fulfillmentDetails.tracking_company,
            notifyCustomer: fulfillmentDetails.notify_customer,
            fulfillmentOrderId: updatedFulfillmentOrderItem.id,
          },
        },
        headers: {
          "X-Shopify-Access-Token": shopify.password,
          "Content-Type": "application/json",
        },
      });

      if (data.errors) {
        throw new Error(
          `GraphQL errors At Create Fulfillment: ${JSON.stringify(data.errors)}`
        );
      }

      createdFulfillmentResponse.push(data.data.fulfillmentCreate.fulfillment);
    }
    return createdFulfillmentResponse;
  }
}
