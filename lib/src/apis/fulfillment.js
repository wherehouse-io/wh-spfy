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
    static async attachRequestId(requestId) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixzQ0FBbUM7QUFDbkMsb0RBQXVCO0FBQ3ZCLHdEQUF1QztBQUN2QyxzREFBaUU7QUFFakUsd0NBQStDO0FBQy9DLHdEQUdvQztBQUNwQyw0REFJc0M7QUFDdEMsbUVBQW9EO0FBYXBELE1BQXFCLGtCQUFrQjtJQUNyQzs7O09BR0c7SUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTO1FBQ3BDLG1CQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDMUIsbUJBQWtCLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQy9CLGtCQUF1QixFQUN2QixrQkFBc0M7UUFFdEMsZUFBTSxDQUFDLElBQUksQ0FDVCxnQ0FBZ0MsSUFBSSxDQUFDLFNBQVMsQ0FDNUMsa0JBQWtCLEVBQ2xCLElBQUksRUFDSixDQUFDLENBQ0YsRUFBRSxDQUNKLENBQUM7UUFDRixJQUFJO1lBQ0YscUNBQXFDO1lBQ3JDLGlIQUFpSDtZQUVqSCxNQUFNLE9BQU8sR0FBRyxrQkFBa0IsYUFBbEIsa0JBQWtCLHVCQUFsQixrQkFBa0IsQ0FBRSxPQUFPLENBQUM7WUFDNUMsZUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU8sSUFBSSxDQUFDLHdDQUF3QyxDQUNsRCxrQkFBa0IsRUFDbEIsT0FBTyxFQUNQLGtCQUFrQixDQUNuQixDQUFDO1NBQ0g7UUFBQyxPQUFPLEdBQVEsRUFBRTtZQUNqQixlQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FB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