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
                    query: fulfillmentMutations_1.FULFILLMENT_MUTATION,
                    variables: {
                        locationId: fulfillmentDetails.location_id,
                        trackingNumber: fulfillmentDetails.tracking_number,
                        trackingUrl: fulfillmentDetails.tracking_urls,
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
                        updatedFulfillmentOrder.push(Object.assign(Object.assign({}, fulfillmentOrderItem), { assigned_location_id: wherehouseAssignedLocationId }));
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
                            locationId: updatedFulfillmentOrderItem.assigned_location_id,
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