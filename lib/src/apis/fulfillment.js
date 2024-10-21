"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
const lodash_1 = __importDefault(require("lodash"));
const shopify_1 = __importDefault(require("./shopify"));
const fulfillment_1 = require("../types/fulfillment");
const helpers_1 = require("../helpers");
const fulfillmentQueries_1 = require("./fulfillmentQueries");
const fulfillmentMutations_1 = require("./fulfillmentMutations");
class FulfillmentService {
    /**
     * @param {Object} fulfillmentDetails
     * @param shopify
     */
    static async createNewFulfillment(fulfillmentDetails, ShopifyUrlInstance) {
        logger_1.logger.info(`!!!!!fulfillmentDetails!!!!! ${JSON.stringify(fulfillmentDetails, null, 2)}`);
        try {
            // delete fulfillmentDetails.orderId;
            // refer to https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment#create-2021-01
            const orderId = fulfillmentDetails === null || fulfillmentDetails === void 0 ? void 0 : fulfillmentDetails.orderId;
            logger_1.logger.info(`!!!!!!!Creating fulfilment!!!!!!!!!`);
            return this.createFulfillmentAtShopifyUpdatedVersion(ShopifyUrlInstance, orderId, fulfillmentDetails);
        }
        catch (err) {
            logger_1.logger.error(err);
            const message = lodash_1.default.get(err, "response.body.errors") || err.message;
            logger_1.logger.error("[Failure Reason]:", JSON.stringify({ message, err }));
            err.message = message;
            throw new Error(err);
        }
    }
    /**
     * Getting fulfillment details from shopify to check whether the order is already fulfilled or not
     * @param externalOrderId
     * @param userId
     */
    static async getFulfillmentDetails(externalOrderId, userId) {
        const shopify = await shopify_1.default.getShopifyUrlInstance(userId);
        const existingFulfillment = await this.getFulFillmentListDetails(shopify, externalOrderId);
        logger_1.logger.info(`!!!!existingFulfillment!!!! ${existingFulfillment}`);
        if (existingFulfillment.length > 0) {
            const notCancelledFulfillment = existingFulfillment.filter((fulfillment) => fulfillment.status !== fulfillment_1.EShopifyFulfillmentStatus.CANCELLED);
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
    static async isAlreadyFulfilledOnShopify(externalOrderId, userId) {
        try {
            const isAlreadyFulfilled = await this.getFulfillmentDetails(externalOrderId, userId);
            if (isAlreadyFulfilled.fulfilled &&
                isAlreadyFulfilled.fulfilledBy !== "Wherehouse") {
                throw new Error(`Order is already fulfilled on shopify by ${isAlreadyFulfilled.fulfilledBy}`);
            }
            if (isAlreadyFulfilled.fulfilled &&
                isAlreadyFulfilled.fulfilledBy === "Wherehouse") {
                logger_1.logger.warn("Order is already fulfilled by Wherehouse");
            }
            return isAlreadyFulfilled;
        }
        catch (err) {
            logger_1.logger.error(err);
            throw err;
        }
    }
    static async getFulFillmentListDetails(shopify, externalOrderId) {
        try {
            // return shopify.fulfillment.list(Number(externalOrderId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const fulfillmentId = `gid://shopify/Order/${externalOrderId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: fulfillmentQueries_1.GET_FULFILLMENT_LIST_COUNT_QUERY,
                    variables: { fulfillmentId },
                },
            });
            return data.order.fulfillments;
        }
        catch (e) {
            throw e;
        }
    }
    static async createFulfillmentAtShopify(shopify, externalOrderId, fulfillmentDetails) {
        try {
            // await shopify.fulfillment.create(orderId, fulfillmentDetails);
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: fulfillmentMutations_1.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS,
                    variables: {
                        trackingNumber: fulfillmentDetails.tracking_number,
                        trackingUrls: fulfillmentDetails.tracking_urls,
                        trackingCompany: fulfillmentDetails.tracking_company,
                        notifyCustomer: fulfillmentDetails.notify_customer,
                        fulfillmentOrderId: externalOrderId,
                    },
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
            if (data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
            }
            return data.data.fulfillmentCreate.fulfillment;
        }
        catch (e) {
            throw e;
        }
    }
    static async createFulfillmentAtShopifyUpdatedVersion(shopify, externalOrderId, fulfillmentDetails) {
        try {
            const shopifyBaseURl = (0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10");
            // Getting Fulfillment Orders
            const url = `${shopifyBaseURl}/graphql.json`;
            logger_1.logger.info(`Shopify call for fulfillment orders: [${url}]`);
            const getFulfillmentOrderId = `gid://shopify/Order/${externalOrderId}`;
            const { data: fulfillmentOrderData } = await (0, axios_1.default)({
                method: "POST",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: fulfillmentQueries_1.GET_FULFILLMENT_ORDER_QUERY,
                    variables: { getFulfillmentOrderId },
                },
            });
            if (!fulfillmentOrderData.data.order.fulfillmentOrders.nodes.length) {
                // throw new Error("Fulfillment Order Is Not Found");
                throw new Error("Permission disabled for new fulfillment flow");
            }
            const updatedFulfillmentOrder = [];
            //check for locationId mapping
            for (const fulfillmentOrderItem of fulfillmentOrderData.data.order
                .fulfillmentOrders.nodes) {
                logger_1.logger.info(`!!!!!!!Started For Fulfillment Order!!!!!!!! ${fulfillmentOrderItem.id}`);
                if (fulfillmentOrderItem.status === "closed") {
                    logger_1.logger.warn(`skipping this fulfillment order(${fulfillmentOrderItem.id}) since status is closed!`);
                    continue;
                }
                const assignedLocationId = fulfillmentOrderItem.assignedLocation.location.id;
                const wherehouseAssignedLocationId = fulfillmentDetails.location_id;
                logger_1.logger.info(`!!!!!!!!!!!assignedLocationId and wherehouseAssignedLocationId!!!!!!!!${assignedLocationId} and ${wherehouseAssignedLocationId}`);
                // if shopify assigned location id and our generated location id do not match then we have to move that fulfillment order to updated location id
                if (wherehouseAssignedLocationId !== assignedLocationId) {
                    //move to the our generated location id
                    const { data: moveLocationData } = await (0, axios_1.default)({
                        method: "POST",
                        url: url,
                        headers: {
                            "Content-Type": "application/json",
                            "X-Shopify-Access-Token": shopify.password,
                        },
                        data: {
                            query: fulfillmentMutations_1.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION,
                            variables: {
                                id: fulfillmentOrderItem.id,
                                wherehouseAssignedLocationId,
                            },
                        },
                    });
                    // IF fulfillment order location is moved successFully then push it into updated fulfillment order array with updated location id
                    // If this fulfillment order location is not moved then will not be pushed so fulfillment twill not be created for that order
                    const movedOrder = moveLocationData.data.fulfillmentOrderMove.movedFulfillmentOrder;
                    if (movedOrder) {
                        updatedFulfillmentOrder.push(Object.assign(Object.assign({}, fulfillmentOrderItem), { "assignedLocation.location.id": wherehouseAssignedLocationId }));
                    }
                    else {
                        updatedFulfillmentOrder.push(fulfillmentOrderItem);
                    }
                }
                else {
                    updatedFulfillmentOrder.push(fulfillmentOrderItem);
                }
            }
            // Create Fulfillment for each fulfillment order
            const createdFulfillmentResponse = [];
            for (const updatedFulfillmentOrderItem of updatedFulfillmentOrder) {
                logger_1.logger.info(`Shopify call create fulfillment: [${url}]`);
                const { data } = await (0, axios_1.default)({
                    method: "POST",
                    url,
                    data: {
                        query: fulfillmentMutations_1.CREATE_FULFILLMENT_MUTATION,
                        variables: {
                            trackingNumber: fulfillmentDetails.tracking_number,
                            trackingUrl: fulfillmentDetails.tracking_urls[0],
                            trackingCompany: fulfillmentDetails.tracking_company,
                            notifyCustomer: fulfillmentDetails.notify_customer,
                            fulfillmentOrderId: updatedFulfillmentOrderItem.id,
                        },
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Access-Token": shopify.password,
                    },
                });
                createdFulfillmentResponse.push(data);
            }
            return createdFulfillmentResponse;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = FulfillmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBQy9DLDZEQUc4QjtBQUM5QixpRUFJZ0M7QUFhaEMsTUFBcUIsa0JBQWtCO0lBQ3JDOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQy9CLGtCQUF1QixFQUN2QixrQkFBc0M7UUFFdEMsZUFBTSxDQUFDLElBQUksQ0FDVCxnQ0FBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FDNUMsa0JBQWtCLEVBQ2xCLElBQUksRUFDSixDQUFDLENBQ0YsRUFBRSxDQUNKLENBQUM7UUFDRixJQUFJO1lBQ0YscUNBQXFDO1lBQ3JDLGlIQUFpSDtZQUVqSCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsYUFBbEIsa0JBQWtCLHVCQUFsQixrQkFBa0IsQ0FBRSxPQUFPLENBQUM7WUFDNUMsZUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sSUFBSSxDQUFDLHdDQUF3QyxDQUNsRCxrQkFBa0IsRUFDbEIsT0FBTyxFQUNQLGtCQUFrQixDQUNuQixDQUFDO1NBQ0g7UUFBQyxPQUFPLEdBQVEsRUFBRTtZQUNqQixlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDbEUsZUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZ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