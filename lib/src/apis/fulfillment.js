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
class FulfillmentService {
    /**
     * @param {Object} fulfillmentDetails
     * @param shopify
     */
    static async createNewFulfillment(fulfillmentDetails, ShopifyUrlInstance) {
        logger_1.logger.info(`!!!!!fulfillmentDetails!!!!! ${JSON.stringify(fulfillmentDetails, null, 2)}`);
        const orderId = fulfillmentDetails === null || fulfillmentDetails === void 0 ? void 0 : fulfillmentDetails.orderId;
        logger_1.logger.info(`!!!!!!orderId and shouldApplyNewVersion!!!!!!! ${orderId}`);
        try {
            // delete fulfillmentDetails.orderId;
            // refer to https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment#create-2021-01
            logger_1.logger.info(`!!!!!!!Fulfillment is creating using newer method!!!!!!!!!`);
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
                fulfilledBy: existingFulfillment[0].tracking_company,
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/orders/${externalOrderId}/fulfillments.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.fulfillments;
        }
        catch (e) {
            throw e;
        }
    }
    static async createFulfillmentAtShopify(shopify, externalOrderId, fulfillmentDetails) {
        try {
            // await shopify.fulfillment.create(orderId, fulfillmentDetails);
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/orders/${externalOrderId}/fulfillments.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const payload = JSON.stringify({
                fulfillment: {
                    location_id: fulfillmentDetails.location_id,
                    tracking_urls: fulfillmentDetails.tracking_urls,
                    tracking_number: fulfillmentDetails.tracking_number,
                    notify_customer: fulfillmentDetails.notify_customer,
                    tracking_company: fulfillmentDetails.tracking_company,
                },
            });
            logger_1.logger.info(payload);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: payload,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.fulfillment;
        }
        catch (e) {
            throw e;
        }
    }
    static async createFulfillmentAtShopifyUpdatedVersion(shopify, externalOrderId, fulfillmentDetails) {
        var _a;
        try {
            const shopifyBaseURl = (0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04");
            // Getting Fulfillment Orders
            const fulfillmentOrdersUrl = `${shopifyBaseURl}/orders/${externalOrderId}/fulfillment_orders.json`;
            logger_1.logger.info(`Shopify call for fulfillment orders: [${fulfillmentOrdersUrl}]`);
            const { data: fulfillmentOrderData } = await (0, axios_1.default)({
                method: "GET",
                url: fulfillmentOrdersUrl,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (((_a = fulfillmentOrderData === null || fulfillmentOrderData === void 0 ? void 0 : fulfillmentOrderData.fulfillment_orders) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                throw new Error("Fulfillment Order Is Not Found");
            }
            const updatedFulfillmentOrder = [];
            //check for locationId mapping
            for (const fulfillmentOrderItem of fulfillmentOrderData.fulfillment_orders) {
                logger_1.logger.info(`!!!!!!!Started For Fulfillment Order!!!!!!!! ${fulfillmentOrderItem.id}`);
                const assignedLocationId = fulfillmentOrderItem.assigned_location_id;
                const wherehouseAssignedLocationId = fulfillmentDetails.location_id;
                logger_1.logger.info(`!!!!!!!!!!!assignedLocationId and wherehouseAssignedLocationId!!!!!!!!${assignedLocationId} and ${wherehouseAssignedLocationId}`);
                // if shopify assigned location id and our generated location id do not match then we have to move that fulfillment order to updated location id
                if (wherehouseAssignedLocationId !== assignedLocationId) {
                    //move to the our generated location id
                    const moveLocationUrl = `${shopifyBaseURl}/fulfillment_orders/${fulfillmentOrderItem.id}/move.json`;
                    logger_1.logger.info(`Shopify call for move location url: [${moveLocationUrl}]`);
                    const { data: moveLocationData } = await (0, axios_1.default)({
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
                    updatedFulfillmentOrder.push(Object.assign(Object.assign({}, fulfillmentOrderItem), { assigned_location_id: !(moveLocationData === null || moveLocationData === void 0 ? void 0 : moveLocationData.original_fulfillment_order)
                            ? fulfillmentOrderItem.assigned_location_id
                            : wherehouseAssignedLocationId }));
                }
                else {
                    updatedFulfillmentOrder.push(Object.assign({}, fulfillmentOrderItem));
                }
            }
            // Create Fulfillment for each fulfillment order
            const createdFulfillmentResponse = [];
            for (const updatedFulfillmentOrderItem of updatedFulfillmentOrder) {
                const url = `${shopifyBaseURl}/fulfillments.json`;
                logger_1.logger.info(`Shopify call create fulfillment: [${url}]`);
                const fulfillmentObject = {
                    location_id: updatedFulfillmentOrderItem.assigned_location_id,
                    notify_customer: fulfillmentDetails.notify_customer,
                    tracking_info: {
                        number: fulfillmentDetails.tracking_number,
                        url: fulfillmentDetails.tracking_urls[0],
                        company: fulfillmentDetails.tracking_company,
                    },
                    line_items_by_fulfillment_order: [
                        {
                            fulfillment_order_id: updatedFulfillmentOrderItem.id,
                        },
                    ],
                };
                logger_1.logger.info(`!!!!!!!!!!fulfillmentObject!!!!!!! ${JSON.stringify(fulfillmentObject, null, 2)}`);
                const { data } = await (0, axios_1.default)({
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
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = FulfillmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBYS9DLE1BQXFCLGtCQUFrQjtJQUNyQzs7O09BR0c7SUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUMvQixrQkFBdUIsRUFDdkIsa0JBQXNDO1FBRXRDLGVBQU0sQ0FBQyxJQUFJLENBQ1QsZ0NBQWdDLElBQUksQ0FBQyxTQUFTLENBQzVDLGtCQUFrQixFQUNsQixJQUFJLEVBQ0osQ0FBQyxDQUNGLEVBQUUsQ0FDSixDQUFDO1FBQ0YsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLGFBQWxCLGtCQUFrQix1QkFBbEIsa0JBQWtCLENBQUUsT0FBTyxDQUFDO1FBQzVDLGVBQU0sQ0FBQyxJQUFJLENBQ1Qsa0RBQWtELE9BQU8sRUFBRSxDQUM1RCxDQUFDO1FBRUYsSUFBSTtZQUNGLHFDQUFxQztZQUNyQyxpSEFBaUg7WUFFakgsZUFBTSxDQUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO1lBQzFFLE9BQU8sSUFBSSxDQUFDLHdDQUF3QyxDQUNsRCxrQkFBa0IsRUFDbEIsT0FBTyxFQUNQLGtCQUFrQixDQUNuQixDQUFDO1NBQ0g7UUFBQyxPQUFPLEdBQVEsRUFBRTtZQUNqQixlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDbEUsZUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFF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