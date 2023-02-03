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
            const url = `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/2022-10/orders/${externalOrderId}/fulfillments.json`;
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
            const url = `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/2021-01/orders/${externalOrderId}/fulfillments.json`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFJakUsTUFBcUIsa0JBQWtCO0lBQ3JDOzs7T0FHRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQy9CLGtCQUF1QixFQUN2QixrQkFBc0M7UUFFdEMsTUFBTSxPQUFPLEdBQUcsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFckQsSUFBSTtZQUNGLE9BQU8sa0JBQWtCLENBQUMsT0FBTyxDQUFDO1lBRWxDLGlIQUFpSDtZQUNqSCxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FDN0Isa0JBQWtCLEVBQ2xCLE9BQU8sRUFDUCxrQkFBa0IsQ0FDbkIsQ0FBQztZQUVGLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFBQyxPQUFPLEdBQVEsRUFBRTtZQUNqQixlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE1BQU0sT0FBTyxHQUFHLGdCQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFDbEUsZUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwRSxHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUNoQyxl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