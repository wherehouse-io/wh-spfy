"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataToProductList = exports.convertShopifyOrderToRestOrder = exports.cleanShopifyIds = exports.getWebhookId = exports.getCompanyId = exports.getShopifyOauthBaseUrl = exports.getShopifyBaseUrl = exports.convertShopifyWeightToGrams = exports.asyncDelay = void 0;
const shopify_1 = require("../types/shopify");
const product_1 = require("../types/product");
const product_2 = require("../constants/product");
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
        name: order.name
        // paymentTerms: formattedPaymentTerms(order.paymentTerms),
    };
};
exports.convertShopifyOrderToRestOrder = convertShopifyOrderToRestOrder;
function transformDataToProductList(data) {
    var _a;
    console.log(data);
    if (!((_a = data === null || data === void 0 ? void 0 : data.products) === null || _a === void 0 ? void 0 : _a.nodes)) {
        throw new Error("Invalid data structure: Missing products.nodes");
    }
    return data.products.nodes.map((product) => {
        return Object.assign(Object.assign({}, product), { id: product.id.match(/\d+/)[0], title: product.title, variants: product.variants.nodes.map((variant) => (Object.assign(Object.assign({}, variant), { id: variant.id.match(/\d+/)[0], inventory_item_id: variant.inventoryItem.id.match(/\d+/)[0] }))) });
    });
}
exports.transformDataToProductList = transformDataToProductList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGVscGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBaUU7QUFDakUsOENBQXdEO0FBQ3hELGtEQUF5RTtBQUV6RTs7OztHQUlHO0FBQ0ksTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUM3QixlQUF1QixHQUFHLEVBQ0gsRUFBRTtJQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2xDLElBQUk7WUFDRixVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQixDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDbEI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFaVyxRQUFBLFVBQVUsY0FZckI7QUFFRjs7OztHQUlHO0FBQ0ksTUFBTSwyQkFBMkIsR0FBRyxDQUN6QyxVQUFnQyxFQUNoQyxNQUFjLEVBQ04sRUFBRTtJQUNWLE1BQU0sdUJBQXVCLEdBQUc7UUFDOUIsQ0FBQyw4QkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQy9CLENBQUMsOEJBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSTtRQUN0QyxDQUFDLDhCQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUs7UUFDcEMsQ0FBQyw4QkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHO0tBQ25DLENBQUM7SUFDRixPQUFPLENBQ0wsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztBQUNKLENBQUMsQ0FBQztB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