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
const queries_1 = require("../helpers/graphql/queries");
const mutations_1 = require("../helpers/graphql/mutations");
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
            const notCancelledFulfillment = existingFulfillment.filter((fulfillment) => fulfillment.status.toLowerCase() !== fulfillment_1.EShopifyFulfillmentStatus.CANCELLED);
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const fulfillmentId = `gid://shopify/Order/${externalOrderId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "X-Shopify-Access-Token": shopify.password,
                    "Content-Type": "application/json",
                },
                data: {
                    query: queries_1.GET_FULFILLMENT_LIST_COUNT_QUERY,
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const id = `gid://shopify/FulfillmentOrder/${externalOrderId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: mutations_1.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS,
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
                throw new Error(`GraphQL errors at fulfillment mutation with multiple tracking url: ${JSON.stringify(data.errors)}`);
            }
            return data.data.fulfillmentCreate.fulfillment;
        }
        catch (e) {
            throw e;
        }
    }
    static async createFulfillmentAtShopifyUpdatedVersion(shopify, externalOrderId, fulfillmentDetails) {
        var _a, _b;
        try {
            const shopifyBaseURl = (0, helpers_1.getShopifyBaseUrl)(shopify);
            // Getting Fulfillment Orders
            const url = `${shopifyBaseURl}/graphql.json`;
            logger_1.logger.info(`Shopify call for fulfillment orders: [${url}]`);
            const fulfillmentOrderId = `gid://shopify/Order/${externalOrderId}`;
            const { data: fulfillmentOrderData } = await (0, axios_1.default)({
                method: "POST",
                url: url,
                headers: {
                    "X-Shopify-Access-Token": shopify.password,
                    "Content-Type": "application/json",
                },
                data: {
                    query: queries_1.GET_FULFILLMENT_ORDER_QUERY,
                    variables: { fulfillmentOrderId },
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
                if (fulfillmentOrderItem.status.toLowerCase() === "closed") {
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
                            "X-Shopify-Access-Token": shopify.password,
                            "Content-Type": "application/json",
                        },
                        data: {
                            query: mutations_1.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION,
                            variables: {
                                id: fulfillmentOrderItem.id,
                                wherehouseAssignedLocationId,
                            },
                        },
                    });
                    if (moveLocationData.errors) {
                        throw new Error(`GraphQL errors At move location: ${JSON.stringify(moveLocationData.errors)}`);
                    }
                    // IF fulfillment order location is moved successFully then push it into updated fulfillment order array with updated location id
                    // If this fulfillment order location is not moved then will not be pushed so fulfillment twill not be created for that order
                    updatedFulfillmentOrder.push(Object.assign(Object.assign({}, fulfillmentOrderItem), { assigned_location_id: !((_b = (_a = moveLocationData === null || moveLocationData === void 0 ? void 0 : moveLocationData.data) === null || _a === void 0 ? void 0 : _a.fulfillmentOrderMove) === null || _b === void 0 ? void 0 : _b.originalFulfillmentOrder)
                            ? fulfillmentOrderItem.assignedLocation.location.id
                            : wherehouseAssignedLocationId }));
                }
                else {
                    updatedFulfillmentOrder.push(Object.assign({}, fulfillmentOrderItem));
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
                        query: mutations_1.CREATE_FULFILLMENT_MUTATION,
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
                    throw new Error(`GraphQL errors At Create Fulfillment: ${JSON.stringify(data.errors)}`);
                }
                createdFulfillmentResponse.push(data.data.fulfillmentCreate.fulfillment);
            }
            return createdFulfillmentResponse;
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = FulfillmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBQy9DLHdEQUdvQztBQUNwQyw0REFJc0M7QUFhdEMsTUFBcUIsa0JBQWtCO0lBQ3JDOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQy9CLGtCQUF1QixFQUN2QixrQkFBc0M7UUFFdEMsZUFBTSxDQUFDLElBQUksQ0FDVCxnQ0FBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FDNUMsa0JBQWtCLEVBQ2xCLElBQUksRUFDSixDQUFDLENBQ0YsRUFBRSxDQUNKLENBQUM7UUFDRixJQUFJO1lBQ0YscUNBQXFDO1lBQ3JDLGlIQUFpSDtZQUVqSCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsYUFBbEIsa0JBQWtCLHVCQUFsQixrQkFBa0IsQ0FBRSxPQUFPLENBQUM7WUFDNUMsZUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sSUFBSSxDQUFDLHdDQUF3QyxDQUNsRCxrQkFBa0IsRUFDbEIsT0FBTyxFQUNQLGtCQUFrQixDQUNuQixDQUFDO1NBQ0g7UUFBQyxPQUFPLEdBQVEsRUFBRTtZQUNqQixlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDbEUsZUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZ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