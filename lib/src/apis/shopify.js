"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
const shopify_api_node_1 = __importDefault(require("shopify-api-node"));
const shopify_1 = require("../types/shopify");
const helpers_1 = require("../helpers");
const mutations_1 = require("../helpers/graphql/mutations");
const queries_1 = require("../helpers/graphql/queries");
const requestIdManager_1 = require("../utils/requestIdManager");
class ShopifyService {
    static setRequestId(requestId) {
        (0, requestIdManager_1.setRequestId)(requestId); // Set the request ID in the global manager
    }
    static cleanCache() {
        for (const prop of Object.getOwnPropertyNames(this.shopifyCredsCache)) {
            delete this.shopifyCredsCache[prop];
        }
    }
    static cleanShopUrl(shopURL) {
        // remove preceding https://
        if (String(shopURL).includes("https://")) {
            shopURL = shopURL.split("https://")[1];
        }
        if (String(shopURL).includes("http://")) {
            shopURL = shopURL.split("http://")[1];
        }
        // remove succeeding slashes
        if (shopURL[shopURL.length - 1] === "/") {
            shopURL = shopURL.split("/")[0];
        }
        return shopURL;
    }
    static async getShopifyUrlInstance(userId) {
        try {
            const shopType = shopify_1.SHOP_TYPE.SHOPIFY;
            let shopCredentials;
            // check cache for shop credentials
            if (this.shopifyCredsCache[userId] &&
                this.shopifyCredsCache[userId][shopType]) {
                shopCredentials = this.shopifyCredsCache[userId][shopType];
            }
            else {
                // call profile api to fetch shopify creds
                const { UMS_AUTH_URL, UMS_AUTH_PARAM } = process.env;
                const url = `${UMS_AUTH_URL}/ums/s2s/store-credentials?userId=${userId}&shopType=${shopType}`;
                logger_1.logger.info(`s2s call: [${url}]`);
                const { data: { responseBody }, } = await (0, axios_1.default)({
                    method: "GET",
                    url,
                    headers: {
                        Authorization: UMS_AUTH_PARAM || "",
                    },
                });
                shopCredentials = responseBody;
                // insert into cache
                if (!this.shopifyCredsCache[userId]) {
                    this.shopifyCredsCache[userId] = {};
                }
                this.shopifyCredsCache[userId][shopType] = shopCredentials;
            }
            const { shop, key: apiKey, secret: password } = shopCredentials;
            const shopName = this.cleanShopUrl(shop);
            return {
                shopName,
                apiKey,
                password,
            };
        }
        catch (error) {
            logger_1.logger.error(error);
            throw error;
        }
    }
    static async getShopifyInstance(userId) {
        const shopType = "shopify";
        const UMS_AUTH_URL = process.env.UMS_AUTH_URL;
        const UMS_AUTH_PARAM = process.env.UMS_AUTH_PARAM;
        let shopCredentials;
        // check cache for shop credentials
        if (this.shopifyCredsCache[userId] &&
            this.shopifyCredsCache[userId][shopType]) {
            shopCredentials = this.shopifyCredsCache[userId][shopType];
        }
        else {
            // call profile api to fetch shopify creds
            const url = `${UMS_AUTH_URL}/ums/s2s/store-credentials?userId=${userId}&shopType=${shopType}`;
            logger_1.logger.info(`s2s call: [${url}]`);
            const { data: { responseBody }, } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    Authorization: UMS_AUTH_PARAM || "",
                },
            });
            shopCredentials = responseBody;
            // insert into cache
            if (!this.shopifyCredsCache[userId]) {
                this.shopifyCredsCache[userId] = {};
            }
            this.shopifyCredsCache[userId][shopType] = shopCredentials;
        }
        const { shop, key: apiKey, secret: password } = shopCredentials;
        const shopName = this.cleanShopUrl(shop);
        return new shopify_api_node_1.default({
            shopName,
            apiKey,
            password,
        });
    }
    /**
     * @param {string | number} warehousZip Pincode of wareouse whose location is required
     * @param {*} shopifyRef
     */
    static async getLocationIdFromShopify(warehousZip, shopifyRef) {
        var _a, _b;
        try {
            // find out active shopify locations
            const allLocations = await this.getLocationList(shopifyRef);
            const activeLocations = allLocations.filter((l) => l.isActive && l.address.zip);
            if (activeLocations.length === 0) {
                throw new Error("[Error fetch shopify locations]: No location exists in shopify, please create atleast one location to fulfill the orders");
            }
            // if zip matches return location of warehouse
            // else return id of the first warehouse
            console.log("!!!!activeLocations!!!!", activeLocations);
            const matchedLocation = activeLocations.find((loc) => loc.address.zip === String(warehousZip));
            // hack: take last location or the first one - do you beauti has stock present in last one only
            return matchedLocation
                ? matchedLocation.id
                : ((_a = activeLocations[activeLocations.length - 1]) === null || _a === void 0 ? void 0 : _a.id) ||
                    ((_b = activeLocations[0]) === null || _b === void 0 ? void 0 : _b.id);
        }
        catch (err) {
            logger_1.logger.error(err);
            throw err;
        }
    }
    static async getLocationList(shopifyRef) {
        return this.getLocationData(shopifyRef);
    }
    /**
     * @description function to cancel order on shopify
     * NOTE: Orders that are paid and have fulfillments can't be canceled on Shopify.
     * @param orderData
     * @param userId
     */
    static async cancelOrderOnShopify(externalOrderId, userId) {
        try {
            logger_1.logger.info(`Getting shopify instance for cancelling order on Shopify for userId: ${userId}`);
            const shopify = await this.getShopifyUrlInstance(userId);
            logger_1.logger.info(`Order External OrderId: ${externalOrderId}`);
            let isCancelled;
            if (externalOrderId) {
                isCancelled = await this.cancelOrder(shopify, externalOrderId);
                logger_1.logger.info(`Is cancelled on shopify: ${JSON.stringify(isCancelled)}`);
            }
            return isCancelled;
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    static async cancelOrder(shopify, externalOrderId) {
        return this.cancelOrderApi(shopify, externalOrderId);
    }
    /**
     * @description function to cancel order fulfillment on shopify
     * @param orderData
     * @param userId
     */
    static async cancelOrderFulfillment(externalOrderId, userId) {
        try {
            logger_1.logger.info(`Getting shopify instance for cancelling order fulfillment on Shopify for userId: ${userId}`);
            if (!externalOrderId) {
                logger_1.logger.info(`!!!!!!!External Order Id is not provided!!!!!!! ${JSON.stringify(externalOrderId, null, 2)}`);
                return;
            }
            const shopify = await this.getShopifyUrlInstance(userId);
            logger_1.logger.info(`Shopify instance: ${JSON.stringify(shopify, null, 2)}`);
            const wherehouseFulfillment = await this.getWherehouseFulfillment(shopify, externalOrderId);
            logger_1.logger.info(`Wherehouse Fulfillment: ${JSON.stringify(wherehouseFulfillment, null, 2)}`);
            let isFulfillmentCancelled = false;
            if (wherehouseFulfillment) {
                isFulfillmentCancelled = await this.cancelFulfillment(shopify, externalOrderId, wherehouseFulfillment);
                logger_1.logger.info(`Fulfillment cancellation response: ${JSON.stringify(isFulfillmentCancelled, null, 2)}`);
            }
            return isFulfillmentCancelled;
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    static async getWherehouseFulfillment(shopify, externalOrderId) {
        const shopifyOrderData = await this.getOrderData(shopify, externalOrderId);
        const wherehouseFulfillment = shopifyOrderData.fulfillments.filter((fulfillment) => fulfillment.tracking_company === "Wherehouse")[0];
        return wherehouseFulfillment;
    }
    static async cancelFulfillment(shopify, externalOrderId, wherehouseFulfillment) {
        return this.cancelFulfillmentApi(shopify, externalOrderId, wherehouseFulfillment);
    }
    /**
     * @description function to mark cod order as prepaid on shopify when cod order gets delivered
     * @param orderData
     * @param userId
     */
    static async markCODOrderAsPaid(externalOrderId, userId) {
        try {
            const shopify = await this.getShopifyUrlInstance(userId);
            const createdTransactions = await this.createTransactionAtShopify(shopify, externalOrderId);
            if (createdTransactions[`errors`]) {
                throw new Error(JSON.stringify(createdTransactions[`errors`], null, 2));
            }
            return createdTransactions;
        }
        catch (error) {
            logger_1.logger.error(error);
        }
    }
    /**
     * figures out hsn code corresponding to variants of different shopify products
     * @param userId company id
     * @param productIds product ids as an array of numbers
     * @param limitOnError flag to decide whether to throw error or send whatever data collected so far
     * @returns array of object containing product id and variants array containing with id and hsn
     */
    static async getVariantHSNCodes(userId, productIds, limitOnError = false) {
        try {
            const shopifyUrlInstance = await this.getShopifyUrlInstance(userId);
            const hsnData = [];
            for (const productId of productIds) {
                const { variants } = await this.getProductData(shopifyUrlInstance, productId, "variants");
                const responseVariants = [];
                // since large number of variant causes excessive API calls to Shopify, eventually surpassing 2 req/s limit;
                // we are Avoiding hsn assignment to products having variant more than a specified limit
                const MAX_ALLOWED_SHOPIFY_VARIANT = 3;
                if (variants.nodes.length > MAX_ALLOWED_SHOPIFY_VARIANT) {
                    continue;
                }
                for (const variant of variants.nodes) {
                    logger_1.logger.info(`delay invoked for ${variant.id}`);
                    await (0, helpers_1.asyncDelay)(500); // delay for half second to avoid 429(too many request) error from Shopify.
                    logger_1.logger.info(`delay finished for ${variant.id}`);
                    const { inventoryItem } = variant;
                    try {
                        try {
                            const { harmonizedSystemCode } = await this.getInventoryItemData(shopifyUrlInstance, String(inventoryItem.id));
                            responseVariants.push({
                                id: String(variant.id),
                                hsn: harmonizedSystemCode ? String(harmonizedSystemCode) : "", // do not parse directy with String(), null also gets strigified :X
                            });
                            logger_1.logger.info(`HSN - ${productId} - ${variant.id} - ${harmonizedSystemCode}`);
                        }
                        catch (error) {
                            logger_1.logger.error(`Error while getting HSN: ${JSON.stringify(error, null, 2)}`);
                        }
                    }
                    catch (err) {
                        logger_1.logger.error(err);
                        logger_1.logger.info(`limiting to ${hsnData.length} for user id: ${userId}`);
                        if (limitOnError) {
                            return hsnData;
                        }
                        throw err;
                    }
                }
                hsnData.push({
                    productId: String(productId),
                    variants: responseVariants,
                });
            }
            return hsnData;
        }
        catch (err) {
            logger_1.logger.error(err);
            throw err;
        }
    }
    static async cancelFulfillmentApi(shopify, externalOrderId, wherehouseFulfillment) {
        try {
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            // return shopify.fulfillment.cancel(
            //   Number(externalOrderId),
            //   wherehouseFulfillment.id
            // );
            // According to older version
            // const url = `${getShopifyBaseUrl(
            //   shopify
            // )}/orders/${externalOrderId}/fulfillments/${
            //   wherehouseFulfillment.id
            // }/cancel.json`;
            const fulfillmentId = `gid://shopify/Fulfillment/${wherehouseFulfillment.id}`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: mutations_1.CANCEL_FULFILLMENT,
                    variables: { fulfillmentId },
                },
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
            if (data.errors) {
                throw new Error(`GraphQL errors At Cancel Fulfillment: ${JSON.stringify(data.errors)}`);
            }
            return data.data.fulfillmentCancel.fulfillment;
        }
        catch (e) {
            throw e;
        }
    }
    static async getOrderData(shopify, externalOrderId) {
        try {
            // const shopifyOrderData = await shopify.order.get(Number(externalOrderId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const getOrderId = `gid://shopify/Order/${externalOrderId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: queries_1.GET_ORDER_DATA,
                    variables: { getOrderId },
                },
            });
            const formattedOrder = (0, helpers_1.convertShopifyOrderToRestOrder)(data.data.order);
            const cleanIdOrder = (0, helpers_1.cleanShopifyIds)(formattedOrder);
            return Object.assign(Object.assign({}, cleanIdOrder), { gateway: data.data.order.paymentGatewayNames &&
                    data.data.order.paymentGatewayNames.length > 0
                    ? data.data.order.paymentGatewayNames[0]
                    : "" });
        }
        catch (e) {
            throw e;
        }
    }
    static async getLocationData(shopify) {
        try {
            // return shopifyRef.location.list();
            // locations
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: queries_1.GET_LOCATION_DATA,
                },
            });
            // here we need to change the graphql location id to numeric locationid
            const formattedData = data.data.locations.nodes.map((location) => {
                const updatedId = location.id.match(/\d+/);
                return Object.assign({ id: updatedId[0] }, location);
            });
            return formattedData;
        }
        catch (e) {
            throw e;
        }
    }
    static async cancelOrderApi(shopify, externalOrderId) {
        try {
            // return shopify.order.cancel(Number(externalOrderId));
            // orders/${externalOrderId}/cancel
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const orderId = `gid://shopify/Order/${externalOrderId}`;
            const reason = "OTHER";
            const restock = false;
            const refund = false;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: mutations_1.CANCEL_ORDER,
                    variables: { orderId, reason, refund, restock },
                },
            });
            if (data.errors) {
                throw new Error(`GraphQL errors At Cancel Order: ${JSON.stringify(data.errors)}`);
            }
            const jobId = data.data.orderCancel.job.id;
            //   query to check the order is cancelled or not
            const cancelOrderStatusData = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: queries_1.CHECK_ORDER_CANCEL_STATUS,
                    variables: { jobId },
                },
            });
            return cancelOrderStatusData.data.data.job.done;
        }
        catch (e) {
            throw e;
        }
    }
    static async getAllProductList(shopify, limitNumber, productIds) {
        try {
            // const { variants } = await shopify.product.get(Number(productId));
            // let url='';
            // if (productIds) {
            //   url = `${getShopifyBaseUrl(
            //     shopify,
            //     "2024-01"
            //   )}/products.json?ids=${productIds}&limit=${limitNumber}`;
            // } else {
            //   url = `${getShopifyBaseUrl(
            //     shopify,
            //     "2023-04"
            //   )}/products.json?limit=${limitNumber}`;
            // }
            const baseUrl = (0, helpers_1.getShopifyBaseUrl)(shopify);
            const url = `${baseUrl}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const query = productIds === null || productIds === void 0 ? void 0 : productIds.split(",").map((id) => `id:${id.trim()}`).join(" OR ");
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: (0, queries_1.getProductsByIdsQuery)(query),
                    variables: { limit: limitNumber },
                },
            });
            const formattedData = (0, helpers_1.transformDataToProductList)(data.data);
            return formattedData;
        }
        catch (e) {
            throw e;
        }
    }
    static async getProductData(shopify, productId, fields) {
        var _a;
        try {
            // const { variants } = await shopify.product.get(Number(productId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            const shopifyProductId = `gid://shopify/Product/${productId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: queries_1.GET_PRODUCT_DATA,
                    variables: { shopifyProductId },
                },
            });
            return (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.product;
        }
        catch (e) {
            throw e;
        }
    }
    static async getInventoryItemData(shopify, inventoryItemId) {
        try {
            // const { harmonized_system_code } =
            //   await shopify.inventoryItem.get(inventory_item_id);
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: queries_1.GET_INVENTORY_ITEM_DATA,
                    variables: { inventoryItemId },
                },
            });
            return data.data.inventoryItem;
        }
        catch (e) {
            throw e;
        }
    }
    static async getAccessScopeData(shopify) {
        try {
            // access_scopes
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: queries_1.GET_ACCESS_SCOPE_DATA,
                },
            });
            return data.data.currentAppInstallation.accessScopes;
        }
        catch (e) {
            throw e;
        }
    }
    // static async createTransactionAtShopify(
    //   shopify: Shopify,
    //   externalOrderId: string
    // ) {
    //   return shopify.transaction.create(Number(externalOrderId), {
    //     source: "external",
    //     kind: "capture",
    //   });
    // }
    static async createTransactionAtShopify(shopify, externalOrderId) {
        try {
            // const createdTransactions = await this.createTransactionAtShopify(
            //   shopify,
            //   externalOrderId
            // );
            //TODO: Need to update version and check payload
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const orderId = `gid://shopify/Order/${externalOrderId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: mutations_1.MARK_COD_ORDER_AS_PAID,
                    variables: {
                        input: {
                            id: orderId,
                        },
                    },
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
            if (data.errors) {
                throw new Error(`Shopify GraphQL Error  At Create Transaction: ${JSON.stringify(data.errors)}`);
            }
            const markCodOrderAsPaidData = data.data.orderMarkAsPaid.order;
            if (markCodOrderAsPaidData.displayFinancialStatus !== "PAID") {
                throw new Error("mark cod order as paid failed");
            }
            return markCodOrderAsPaidData;
        }
        catch (e) {
            throw e;
        }
    }
    static async inventoryUpdateAtShopifyForRTO(shopify, inventoryUpdateObject) {
        var _a;
        try {
            // inventory_levels/adjust
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            logger_1.logger.info(`inventory udpate object: ${JSON.stringify(inventoryUpdateObject)}`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: mutations_1.INVENTORY_UPDATE,
                    variables: {
                        available_adjustment: inventoryUpdateObject.available_adjustment,
                        location_id: inventoryUpdateObject.location_id,
                        name: "available",
                        reason: "correction",
                        inventory_item_id: `gid://shopify/InventoryItem/${inventoryUpdateObject.inventory_item_id}`,
                    },
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
            if (data.errors) {
                throw new Error(`GraphQL errors At Inventory Update: ${JSON.stringify(data.errors)}`);
            }
            return (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.inventoryAdjustQuantities;
        }
        catch (e) {
            logger_1.logger.error(e);
            throw e;
        }
    }
}
exports.default = ShopifyService;
// maintain a local cache for shop api keys, password etc.
// will be refreshed every week
ShopifyService.shopifyCredsCache = {};
// clean credentials cache after 7 days
setTimeout(async () => {
    try {
        ShopifyService.cleanCache();
    }
    catch (err) {
        logger_1.logger.error(err);
    }
}, 7 * 24 * 60 * 60);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Nob3BpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsc0NBQW1DO0FBQ25DLHdFQUE0RTtBQUM1RSw4Q0FLMEI7QUFDMUIsd0NBTW9CO0FBQ3BCLDREQUtzQztBQUN0Qyx3REFRb0M7QUFDcEMsZ0VBQXlEO0FBRXpELE1BQXFCLGNBQWM7SUFLakMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFpQjtRQUNuQyxJQUFBLCtCQUFZLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywyQ0FBMkM7SUFDdEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVO1FBQ2YsS0FBSyxNQUFNLElBQUksSUFBSSxNQUFNLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDckUsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFlO1FBQ2pDLDRCQUE0QjtRQUM1QixJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDeEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDdkMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkM7UUFFRCw0QkFBNEI7UUFDNUIsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDdkMsT0FBTyxHQUFHLE9BQU8sQ0FB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