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
const namespace_1 = __importDefault(require("../utils/namespace"));
class FulfillmentService {
    /**
     * @param {Object} fulfillmentDetails
     * @param shopify
     */
    static attachRequestId(requestId) {
        namespace_1.default.run(() => {
            namespace_1.default.set("requestId", requestId);
        });
        return this;
    }
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
        logger_1.logger.info(`response --- ${JSON.stringify((_c = (_b = (_a = fulfillmentOrderData === null || fulfillmentOrderData === void 0 ? void 0 : fulfillmentOrderData.data) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.fulfillmentOrders) === null || _c === void 0 ? void 0 : _c.nodes)}`);
        if (!((_g = (_f = (_e = (_d = fulfillmentOrderData.data) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.fulfillmentOrders) === null || _f === void 0 ? void 0 : _f.nodes) === null || _g === void 0 ? void 0 : _g.length)) {
            // throw new Error("Fulfillment Order Is Not Found");
            logger_1.logger.error(`Fulfillment Order Is Not Found`);
            throw new Error("Permission disabled for new fulfillment flow");
        }
        const updatedFulfillmentOrder = [];
        //check for locationId mapping
        for (const fulfillmentOrderItem of (_k = (_j = (_h = fulfillmentOrderData === null || fulfillmentOrderData === void 0 ? void 0 : fulfillmentOrderData.data) === null || _h === void 0 ? void 0 : _h.order) === null || _j === void 0 ? void 0 : _j.fulfillmentOrders) === null || _k === void 0 ? void 0 : _k.nodes) {
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
                updatedFulfillmentOrder.push(Object.assign(Object.assign({}, fulfillmentOrderItem), { assigned_location_id: !((_m = (_l = moveLocationData === null || moveLocationData === void 0 ? void 0 : moveLocationData.data) === null || _l === void 0 ? void 0 : _l.fulfillmentOrderMove) === null || _m === void 0 ? void 0 : _m.originalFulfillmentOrder)
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
}
exports.default = FulfillmentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBQy9DLHdEQUdvQztBQUNwQyw0REFJc0M7QUFDdEMsbUVBQW9EO0FBYXBELE1BQXFCLGtCQUFrQjtJQUNyQzs7O09BR0c7SUFFSCxNQUFNLENBQUUsZUFBZSxDQUFDLFNBQVM7UUFDL0IsbUJBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUMxQixtQkFBa0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FDL0Isa0JBQXVCLEVBQ3ZCLGtCQUFzQztRQUV0QyxlQUFNLENBQUMsSUFBSSxDQUNULGdDQUFnQyxJQUFJLENBQUMsU0FBUyxDQUM1QyxrQkFBa0IsRUFDbEIsSUFBSSxFQUNKLENBQUMsQ0FDRixFQUFFLENBQ0osQ0FBQztRQUNGLElBQUk7WUFDRixxQ0FBcUM7WUFDckMsaUhBQWlIO1lBRWpILE1BQU0sT0FBTyxHQUFHLGtCQUFrQixhQUFsQixrQkFBa0IsdUJBQWxCLGtCQUFrQixDQUFFLE9BQU8sQ0FBQztZQUM1QyxlQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7WUFDbkQsT0FBTyxJQUFJLENBQUMsd0NBQXdDLENBQ2xELGtCQUFrQixFQUNsQixPQUFPLEVBQ1Asa0JBQWtCLENBQ25CLENBQUM7U0FDSDtRQUFDLE9BQU8sR0FBUSxFQUFFO1lBQ2pCLGVBQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFD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