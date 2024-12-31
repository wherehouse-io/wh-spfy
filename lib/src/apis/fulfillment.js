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
                    "X-Shopify-Access-Token": shopify.password,
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
                    "X-Shopify-Access-Token": shopify.password,
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
                    "X-Shopify-Access-Token": shopify.password,
                    "Content-Type": "application/json",
                },
            });
            if (((_a = fulfillmentOrderData === null || fulfillmentOrderData === void 0 ? void 0 : fulfillmentOrderData.fulfillment_orders) === null || _a === void 0 ? void 0 : _a.length) === 0) {
                // throw new Error("Fulfillment Order Is Not Found");
                throw new Error("Permission disabled for new fulfillment flow");
            }
            const updatedFulfillmentOrder = [];
            //check for locationId mapping
            for (const fulfillmentOrderItem of fulfillmentOrderData.fulfillment_orders) {
                logger_1.logger.info(`!!!!!!!Started For Fulfillment Order!!!!!!!! ${fulfillmentOrderItem.id}`);
                if (fulfillmentOrderItem.status === "closed") {
                    logger_1.logger.warn(`skipping this fulfillment order(${fulfillmentOrderItem.id}) since status is closed!`);
                    continue;
                }
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
                            "X-Shopify-Access-Token": shopify.password,
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
                        "X-Shopify-Access-Token": shopify.password,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBYS9DLE1BQXFCLGtCQUFrQjtJQUNyQzs7O09BR0c7SUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUMvQixrQkFBdUIsRUFDdkIsa0JBQXNDO1FBRXRDLGVBQU0sQ0FBQyxJQUFJLENBQ1QsZ0NBQWdDLElBQUksQ0FBQyxTQUFTLENBQzVDLGtCQUFrQixFQUNsQixJQUFJLEVBQ0osQ0FBQyxDQUNGLEVBQUUsQ0FDSixDQUFDO1FBQ0YsSUFBSTtZQUNGLHFDQUFxQztZQUNyQyxpSEFBaUg7WUFFakgsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLGFBQWxCLGtCQUFrQix1QkFBbEIsa0JBQWtCLENBQUUsT0FBTyxDQUFDO1lBQzVDLGVBQU0sQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUNuRCxPQUFPLElBQUksQ0FBQyx3Q0FBd0MsQ0FDbEQsa0JBQWtCLEVBQ2xCLE9BQU8sRUFDUCxrQkFBa0IsQ0FDbkIsQ0FBQztTQUNIO1FBQUMsT0FBTyxHQUFRLEVBQUU7WUFDakIsZUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixNQUFNLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ2xFLGVBQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEUsR0FBRyxDQUFDLE9BQU8sR0FBRyxP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