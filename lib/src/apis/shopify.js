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
class ShopifyService {
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
            return Object.assign(Object.assign({}, formattedOrder), { gateway: data.data.order.paymentGatewayNames &&
                    data.data.order.paymenxtGatewayNames.length > 0
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify)}/graph.json`;
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
            return !data.data.orderCancel.job.done;
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
            const amount = 100;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: mutations_1.CREATE_TRANSACTION,
                    variables: {
                        input: {
                            orderId: orderId,
                            amount,
                            parentTransactionId: null,
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
            const transaction = data.data.orderCapture.transaction;
            if (!transaction) {
                throw new Error("Transaction creation failed");
            }
            return data.data.transaction;
        }
        catch (e) {
            throw e;
        }
    }
    static async inventoryUpdateAtShopifyForRTO(shopify, inventoryUpdateObject) {
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
                        location_id: `gid://shopify/Location/${inventoryUpdateObject.location_id}`,
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
            return data.data.inventoryLevel;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Nob3BpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsc0NBQW1DO0FBQ25DLHdFQUE0RTtBQUM1RSw4Q0FLMEI7QUFDMUIsd0NBS29CO0FBQ3BCLDREQUtzQztBQUN0Qyx3REFPb0M7QUFFcEMsTUFBcUIsY0FBYztJQUtqQyxNQUFNLENBQUMsVUFBVTtRQUNmLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3JFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBZTtRQUNqQyw0QkFBNEI7UUFDNUIsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsNEJBQTRCO1FBQzVCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ3ZDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMs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