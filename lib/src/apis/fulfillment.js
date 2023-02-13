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
        const orderId = lodash_1.default.get(fulfillmentDetails, "orderId");
        try {
            delete fulfillmentDetails.orderId;
            // refer to https://shopify.dev/docs/admin-api/rest/reference/shipping-and-fulfillment/fulfillment#create-2021-01
            await this.createFulfillmentApi(ShopifyUrlInstance, orderId, fulfillmentDetails);
            return null;
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
        console.log("!!!!existingFulfillment!!!!", existingFulfillment);
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2022-10")}orders/${externalOrderId}/fulfillments.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.fulfillments;
        }
        catch (e) {
            throw e;
        }
    }
    static async createFulfillmentApi(shopify, externalOrderId, fulfillmentDetails) {
        try {
            // await shopify.fulfillment.create(orderId, fulfillmentDetails);
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}orders/${externalOrderId}/fulfillments.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
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
        }
        catch (e) {
            throw e;
        }
    }
}
exports.default = FulfillmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBRS9DLE1BQXFCLGtCQUFrQjtJQUNyQzs7O09BR0c7SUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUMvQixrQkFBdUIsRUFDdkIsa0JBQXNDO1FBRXRDLE1BQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXJELElBQUk7WUFDRixPQUFPLGtCQUFrQixDQUFDLE9BQU8sQ0FBQztZQUVsQyxpSEFBaUg7WUFDakgsTUFBTSxJQUFJLENBQUMsb0JBQW9CLENBQzdCLGtCQUFrQixFQUNsQixPQUFPLEVBQ1Asa0JBQWtCLENBQ25CLENBQUM7WUFFRixPQUFPLElBQUksQ0FBQztTQUNiO1FBQUMsT0FBTyxHQUFRLEVBQUU7WUFDakIsZUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixNQUFNLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsc0JBQXNCLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQ2xFLGVBQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEUsR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxx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