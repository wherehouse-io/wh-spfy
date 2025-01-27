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
            const reqid = namespace_1.default.get("requestId");
            logger_1.logger.info(`reqid---${JSON.stringify(reqid)}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBQy9DLHdEQUdvQztBQUNwQyw0REFJc0M7QUFDdEMsbUVBQW9EO0FBYXBELE1BQXFCLGtCQUFrQjtJQUNyQzs7O09BR0c7SUFFSCxNQUFNLENBQUMsZUFBZSxDQUFDLFNBQVM7UUFDOUIsbUJBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtZQUMxQixtQkFBa0IsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sS0FBSyxHQUFHLG1CQUFrQixDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRCxlQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUMvQixrQkFBdUIsRUFDdkIsa0JBQXNDO1FBRXRDLGVBQU0sQ0FBQyxJQUFJLENBQ1QsZ0NBQWdDLElBQUksQ0FBQyxTQUFTLENBQzVDLGtCQUFrQixFQUNsQixJQUFJLEVBQ0osQ0FBQyxDQUNGLEVBQUUsQ0FDSixDQUFDO1FBQ0YsSUFBSTtZQUNGLHFDQUFxQztZQUNyQyxpSEFBaUg7WUFFakgsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLGFBQWxCLGtCQUFrQix1QkFBbEIsa0JBQWtCLENBQUUsT0FBTyxDQUFDO1lBQzVDLGVBQU0sQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztZQUNuRCxPQUFP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