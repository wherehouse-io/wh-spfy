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
            const notCancelledFulfillment = existingFulfillment.filter((fulfillment) => fulfillment.status.toLowerCase() !==
                fulfillment_1.EShopifyFulfillmentStatus.CANCELLED);
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
                logger_1.logger.error(`Fulfillment Order Is Not Found`);
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