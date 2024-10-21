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
const shopifyMutations_1 = require("./shopifyMutations");
const shopifyQueries_1 = require("./shopifyQueries");
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
                const { variants } = await this.getProductData(shopifyUrlInstance, String(productId), "variants");
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
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
            const fulfillmentId = wherehouseFulfillment.id;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: shopifyMutations_1.CANCEL_FULFILLMENT,
                    variables: { fulfillmentId },
                },
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
            return data.data.fulfillmentCancel.fulfillment;
        }
        catch (e) {
            throw e;
        }
    }
    static async getOrderData(shopify, externalOrderId) {
        try {
            // const shopifyOrderData = await shopify.order.get(Number(externalOrderId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
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
                    query: shopifyQueries_1.GET_ORDER_DATA,
                    variables: { getOrderId },
                },
            });
            return Object.assign(Object.assign({}, data.data.order), { gateway: data.data.order.paymentGatewayNames &&
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graph.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: shopifyQueries_1.GET_LOCATION_DATA,
                },
            });
            return data.data.locations.nodes;
        }
        catch (e) {
            throw e;
        }
    }
    static async cancelOrderApi(shopify, externalOrderId) {
        try {
            // return shopify.order.cancel(Number(externalOrderId));
            // orders/${externalOrderId}/cancel
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const cancelOrderId = `gid://shopify/Order/${externalOrderId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: shopifyMutations_1.CANCEL_ORDER,
                    variables: { cancelOrderId },
                },
            });
            return data.data.order;
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
            const baseUrl = (0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10");
            const url = `${baseUrl}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: (0, shopifyQueries_1.getProductsByIdsQuery)(productIds),
                    variables: { limit: limitNumber },
                },
            });
            return data.data.products;
        }
        catch (e) {
            throw e;
        }
    }
    static async getProductData(shopify, productId, fields) {
        try {
            // const { variants } = await shopify.product.get(Number(productId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            const productID = `gid://shopify/Product/${productId}`;
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: shopifyQueries_1.GET_PRODUCT_DATA,
                    variables: { productID },
                },
            });
            return data.data.product;
        }
        catch (e) {
            throw e;
        }
    }
    static async getInventoryItemData(shopify, inventoryItemId) {
        try {
            // const { harmonized_system_code } =
            //   await shopify.inventoryItem.get(inventory_item_id);
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const InventoryItemID = `gid://shopify/InventoryItem/${inventoryItemId}`;
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: shopifyQueries_1.GET_INVENTORY_ITEM_DATA,
                    variables: { InventoryItemID },
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
                data: {
                    query: shopifyQueries_1.GET_ACCESS_SCOPE_DATA,
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
            // orders/${externalOrderId}/transactions.json
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-10")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: shopifyMutations_1.CREATE_TRANSACTION,
                    variables: { externalOrderId },
                },
                headers: {
                    "Content-Type": " application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
            return data.data.transaction;
        }
        catch (e) {
            throw e;
        }
    }
    static async inventoryUpdateAtShopifyForRTO(shopify, inventoryUpdateObject) {
        try {
            // inventory_levels/adjust
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2024-01")}/graphql.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            logger_1.logger.info(`inventory udpate object: ${JSON.stringify(inventoryUpdateObject)}`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: {
                    query: shopifyMutations_1.INVENTORY_UPDATE,
                    variables: { inventoryUpdate: inventoryUpdateObject },
                },
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": shopify.password,
                },
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Nob3BpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsc0NBQW1DO0FBQ25DLHdFQUE0RTtBQUM1RSw4Q0FLMEI7QUFDMUIsd0NBSW9CO0FBQ3BCLHlEQUs0QjtBQUM1QixxREFPMEI7QUFFMUIsTUFBcUIsY0FBYztJQUtqQyxNQUFNLENBQUMsVUFBVTtRQUNmLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1lBQ3JFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBZTtRQUNqQyw0QkFBNEI7UUFDNUIsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBRUQsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3ZDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsNEJBQTRCO1FBQzVCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ3ZDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMs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