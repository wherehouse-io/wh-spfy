"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataToProductList = exports.convertShopifyOrderToRestOrder = exports.cleanShopifyIds = exports.getWebhookId = exports.getCompanyId = exports.getShopifyOauthBaseUrl = exports.getShopifyBaseUrl = exports.convertShopifyWeightToGrams = exports.asyncDelay = void 0;
const shopify_1 = require("../types/shopify");
const product_1 = require("../types/product");
const product_2 = require("../constants/product");
const logger_1 = require("../logger");
/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
const asyncDelay = async (milliSeconds = 500) => {
    return new Promise((resolve, rej) => {
        try {
            setTimeout(() => {
                resolve(null);
            }, milliSeconds);
        }
        catch (err) {
            rej(err);
        }
    });
};
exports.asyncDelay = asyncDelay;
/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
const convertShopifyWeightToGrams = (weightUnit, weight) => {
    const shopifyWeightConvertMap = {
        [product_1.SHOPIFY_WEIGHT_UNITS.GRAMS]: 1,
        [product_1.SHOPIFY_WEIGHT_UNITS.KILOGRAMS]: 1000,
        [product_1.SHOPIFY_WEIGHT_UNITS.OUNCES]: 28.35,
        [product_1.SHOPIFY_WEIGHT_UNITS.POUNDS]: 454,
    };
    return (parseFloat(String(shopifyWeightConvertMap[weightUnit])) *
        parseFloat(String(weight)));
};
exports.convertShopifyWeightToGrams = convertShopifyWeightToGrams;
const getShopifyBaseUrl = (shopify, version) => {
    return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/api/${version || "2024-10"}`;
};
exports.getShopifyBaseUrl = getShopifyBaseUrl;
const getShopifyOauthBaseUrl = (shopify) => {
    return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/oauth`;
};
exports.getShopifyOauthBaseUrl = getShopifyOauthBaseUrl;
/**
 * Used to extract companyId from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
const getCompanyId = (shopType, req) => {
    return String(req.headers[product_2.ADDITIONAL_HEADER.COMPANY]);
};
exports.getCompanyId = getCompanyId;
/**
 * Used to extract Webhook Id from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
const getWebhookId = (shopType, req) => {
    let webhookId = "";
    const ShopTypeWebhookIdMap = {
        [shopify_1.SHOP_TYPE.SHOPIFY]: product_2.WEBHOOK_ID_KEY.SHOPIFY,
        [shopify_1.SHOP_TYPE.WP]: product_2.WEBHOOK_ID_KEY.WP,
        [shopify_1.SHOP_TYPE.CUSTOM]: product_2.WEBHOOK_ID_KEY.CUSTOM,
    };
    webhookId = req.headers[ShopTypeWebhookIdMap[shopType]].toString();
    return webhookId;
};
exports.getWebhookId = getWebhookId;
const cleanShopifyIds = (data) => {
    const extractNumericId = (value) => {
        if (typeof value === "string" && value.startsWith("gid://shopify")) {
            const match = value.match(/\d+/); // Extract numeric part
            return match ? match[0] : value;
        }
        return value;
    };
    const traverseAndClean = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map((item) => traverseAndClean(item));
        }
        else if (typeof obj === "object" && obj !== null) {
            return Object.keys(obj).reduce((acc, key) => {
                acc[key] =
                    key === "createdAt" || key === "updatedAt"
                        ? obj[key]
                        : traverseAndClean(obj[key]);
                return acc;
            }, {});
        }
        else if (typeof obj === "string") {
            return extractNumericId(obj);
        }
        return obj;
    };
    return traverseAndClean(data);
};
exports.cleanShopifyIds = cleanShopifyIds;
// function to convert the graphql order object to rest order object
const formattedOrderItem = (orderItems) => {
    const resultedOrderItems = orderItems.map((itm) => {
        var _a, _b, _c, _d, _e, _f;
        const item = itm.node;
        return Object.assign(Object.assign({}, item), { price: item.originalTotal, variantId: (_a = item.variant) === null || _a === void 0 ? void 0 : _a.id, productId: (_b = item.product) === null || _b === void 0 ? void 0 : _b.id, grams: Number((_f = (_e = (_d = (_c = item === null || item === void 0 ? void 0 : item.variant) === null || _c === void 0 ? void 0 : _c.inventoryItem) === null || _d === void 0 ? void 0 : _d.measurement) === null || _e === void 0 ? void 0 : _e.weight) === null || _f === void 0 ? void 0 : _f.value), discountAllocations: formattedDiscountAllocations(item.discountAllocations), taxLines: formattedTaxLines(item.taxLines) });
    });
    return resultedOrderItems;
};
const formattedDiscountAllocations = (discountAllocations) => {
    const resultedDiscountAllocations = discountAllocations.map((discount) => {
        var _a;
        return Object.assign(Object.assign({}, discount), { amount: (_a = discount === null || discount === void 0 ? void 0 : discount.allocatedAmount) === null || _a === void 0 ? void 0 : _a.amount });
    });
    return resultedDiscountAllocations;
};
const formattedShippingLines = (shippingLines) => {
    const resultedShippingLines = shippingLines.map((s) => {
        var _a;
        const shippingLine = s.node;
        return Object.assign(Object.assign({}, shippingLine), { discountedPrice: (_a = shippingLine === null || shippingLine === void 0 ? void 0 : shippingLine.discountedPrice) === null || _a === void 0 ? void 0 : _a.amount });
    });
    return resultedShippingLines;
};
const formattedTaxLines = (taxline) => {
    const resultedTaxLines = taxline.map((tax) => {
        return Object.assign(Object.assign({}, tax), { rate: tax.ratePercentage });
    });
    return resultedTaxLines;
};
const formattedFulfillments = (fulfillments) => {
    console.log("fulfillments", fulfillments);
    return fulfillments.map((fulfillment) => {
        var _a, _b;
        return Object.assign(Object.assign({}, fulfillment), { tracking_company: (_b = (_a = fulfillment === null || fulfillment === void 0 ? void 0 : fulfillment.trackingInfo) === null || _a === void 0 ? void 0 : _a.company) !== null && _b !== void 0 ? _b : " " });
    });
};
const formattedPaymentTerms = (paymentTerms) => {
    console.log("paymentTerms", paymentTerms);
    return Object.assign(Object.assign({}, paymentTerms), { payment_term_name: paymentTerms.paymentTermsName });
};
const convertShopifyOrderToRestOrder = (order) => {
    // console.log("order", order)
    return {
        billingAddress: order.billingAddress,
        shippingAddress: order.shippingAddress,
        lineItems: formattedOrderItem(order.lineItems.edges),
        taxLines: formattedTaxLines(order.taxLines),
        id: order.id,
        totalWeight: order.totalWeight,
        financialStatus: order.displayFinancialStatus.toLowerCase(),
        customer: order.customer,
        currentTotalPrice: order.currentTotalPriceSet.shopMoney.amount,
        discountCodes: order.discountCodes,
        paymentGatewayNames: order.paymentGatewayNames,
        tags: order.tags[0],
        shippingLines: formattedShippingLines(order.shippingLines.edges),
        taxesIncluded: order.taxesIncluded,
        fulfillments: formattedFulfillments(order.fulfillments),
        cancelledAt: order.cancelledAt,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        name: order.name,
        // paymentTerms: formattedPaymentTerms(order.paymentTerms),
    };
};
exports.convertShopifyOrderToRestOrder = convertShopifyOrderToRestOrder;
function transformDataToProductList(data) {
    var _a;
    logger_1.logger.info(JSON.stringify(data));
    if (!((_a = data === null || data === void 0 ? void 0 : data.products) === null || _a === void 0 ? void 0 : _a.nodes)) {
        throw new Error("Invalid data structure: Missing products.nodes");
    }
    return data.products.nodes.map((product) => {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, product), { id: product.id.match(/\d+/)[0], status: product === null || product === void 0 ? void 0 : product.status.toLowerCase(), images: (_a = product === null || product === void 0 ? void 0 : product.images) === null || _a === void 0 ? void 0 : _a.edges.map((item) => {
                return {
                    id: item.node.id,
                    src: item.node.src,
                };
            }), hasNextPage: (_c = (_b = data === null || data === void 0 ? void 0 : data.products) === null || _b === void 0 ? void 0 : _b.pageInfo) === null || _c === void 0 ? void 0 : _c.hasNextPage, variants: product.variants.nodes.map((variant) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                return (Object.assign(Object.assign({}, variant), { id: variant.id.match(/\d+/)[0], weight: (_c = (_b = (_a = variant === null || variant === void 0 ? void 0 : variant.inventoryItem) === null || _a === void 0 ? void 0 : _a.measurement) === null || _b === void 0 ? void 0 : _b.weight) === null || _c === void 0 ? void 0 : _c.value, weightUnit: (_f = (_e = (_d = variant === null || variant === void 0 ? void 0 : variant.inventoryItem) === null || _d === void 0 ? void 0 : _d.measurement) === null || _e === void 0 ? void 0 : _e.weight) === null || _f === void 0 ? void 0 : _f.unit, productId: (_g = variant === null || variant === void 0 ? void 0 : variant.product) === null || _g === void 0 ? void 0 : _g.id.match(/\d+/)[0], imageId: ((_h = variant === null || variant === void 0 ? void 0 : variant.image) === null || _h === void 0 ? void 0 : _h.id) || "", inventory_item_id: (_j = variant === null || variant === void 0 ? void 0 : variant.inventoryItem) === null || _j === void 0 ? void 0 : _j.id.match(/\d+/)[0] }));
            }) });
    });
}
exports.transformDataToProductList = transformDataToProductList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGVscGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBaUU7QUFDakUsOENBQXdEO0FBQ3hELGtEQUF5RTtBQUN6RSxzQ0FBbUM7QUFFbkM7Ozs7R0FJRztBQUNJLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFDN0IsZUFBdUIsR0FBRyxFQUNILEVBQUU7SUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNsQyxJQUFJO1lBQ0YsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEIsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ2xCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDVjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBWlcsUUFBQSxVQUFVLGNBWXJCO0FBRUY7Ozs7R0FJRztBQUNJLE1BQU0sMkJBQTJCLEdBQUcsQ0FDekMsVUFBZ0MsRUFDaEMsTUFBYyxFQUNOLEVBQUU7SUFDVixNQUFNLHVCQUF1QixHQUFHO1FBQzlCLENBQUMsOEJBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUMvQixDQUFDLDhCQUFvQixDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUk7UUFDdEMsQ0FBQyw4QkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLO1FBQ3BDLENBQUMsOEJBQW9CLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRztLQUNuQyxDQUFDO0lBQ0YsT0FBTyxDQUNMLFVBQVUsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUN2RCxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQzNCLENBQUM7QUFD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