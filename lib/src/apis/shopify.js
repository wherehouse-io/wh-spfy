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
            const activeLocations = allLocations.filter((l) => l.active && l.zip);
            if (activeLocations.length === 0) {
                throw new Error("[Error fetch shopify locations]: No location exists in shopify, please create atleast one location to fulfill the orders");
            }
            // if zip matches return location of warehouse
            // else return id of the first warehouse
            console.log("!!!!activeLocations!!!!", activeLocations);
            const matchedLocation = activeLocations.find((loc) => loc.zip === String(warehousZip));
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
                const { variants } = await this.getProductData(shopifyUrlInstance, String(productId), 'variants');
                const responseVariants = [];
                for (const variant of variants) {
                    logger_1.logger.info(`delay invoked for ${variant.id}`);
                    await (0, helpers_1.asyncDelay)(500); // delay for half second to avoid 429(too many request) error from Shopify.
                    logger_1.logger.info(`delay finished for ${variant.id}`);
                    const { inventory_item_id } = variant;
                    try {
                        try {
                            const { harmonized_system_code } = await this.getInventoryItemData(shopifyUrlInstance, String(inventory_item_id));
                            responseVariants.push({
                                id: String(variant.id),
                                hsn: harmonized_system_code
                                    ? String(harmonized_system_code)
                                    : "", // do not parse directy with String(), null also gets strigified :X
                            });
                            logger_1.logger.info(`HSN - ${productId} - ${variant.id} - ${harmonized_system_code}`);
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/fulfillments/${wherehouseFulfillment.id}/cancel.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: JSON.stringify({}),
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
    static async getOrderData(shopify, externalOrderId) {
        try {
            // const shopifyOrderData = await shopify.order.get(Number(externalOrderId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/orders/${externalOrderId}.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return Object.assign(Object.assign({}, data.order), { gateway: data.order.payment_gateway_names &&
                    data.order.payment_gateway_names.length > 0
                    ? data.order.payment_gateway_names[0]
                    : "" });
        }
        catch (e) {
            throw e;
        }
    }
    static async getLocationData(shopify) {
        try {
            // return shopifyRef.location.list();
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/locations.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.locations;
        }
        catch (e) {
            throw e;
        }
    }
    static async cancelOrderApi(shopify, externalOrderId) {
        try {
            // return shopify.order.cancel(Number(externalOrderId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/orders/${externalOrderId}/cancel.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: JSON.stringify({}),
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.order;
        }
        catch (e) {
            throw e;
        }
    }
    static async getAllProductList(shopify, limitNumber) {
        try {
            // const { variants } = await shopify.product.get(Number(productId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/products.json?limit=${limitNumber}`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.products;
        }
        catch (e) {
            throw e;
        }
    }
    static async getProductData(shopify, productId, fields) {
        try {
            // const { variants } = await shopify.product.get(Number(productId));
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/products/${productId}.json${fields ? `?fields=${fields}` : ""}`;
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            return data.product;
        }
        catch (e) {
            throw e;
        }
    }
    static async getInventoryItemData(shopify, inventoryItemId) {
        try {
            // const { harmonized_system_code } =
            //   await shopify.inventoryItem.get(inventory_item_id);
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-04")}/inventory_items/${inventoryItemId}.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.inventory_item;
        }
        catch (e) {
            throw e;
        }
    }
    static async getAccessScopeData(shopify) {
        try {
            const url = `${(0, helpers_1.getShopifyOauthBaseUrl)(shopify)}/access_scopes.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "GET",
                url,
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.access_scopes;
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
            const url = `${(0, helpers_1.getShopifyBaseUrl)(shopify, "2023-10")}/orders/${externalOrderId}/transactions.json`;
            logger_1.logger.info(`Shopify call: [${url}]`);
            const { data } = await (0, axios_1.default)({
                method: "POST",
                url,
                data: JSON.stringify({
                    transaction: {
                        source: "external",
                        kind: "capture",
                    },
                }),
                headers: {
                    "Content-Type": " application/json",
                },
            });
            return data.transaction;
        }
        catch (e) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Nob3BpZnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsc0NBQW1DO0FBQ25DLHdFQUE0RTtBQUM1RSw4Q0FLMEI7QUFDMUIsd0NBQW1GO0FBRW5GLE1BQXFCLGNBQWM7SUFLakMsTUFBTSxDQUFDLFVBQVU7UUFDZixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNyRSxPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLE9BQWU7UUFDakMsNEJBQTRCO1FBQzVCLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN4QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUVELElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN2QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUVELDRCQUE0QjtRQUM1QixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUN2QyxPQUFPLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNqQztRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUNoQyxNQUFjO1FBRWQsSUFB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