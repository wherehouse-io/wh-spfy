"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_keys_1 = __importDefault(require("camelcase-keys"));
const product_1 = require("../types/product");
const product_2 = require("../types/product");
const helpers_1 = require("../helpers");
const shopify_1 = __importDefault(require("./shopify"));
const logger_1 = require("../logger");
const requestIdManager_1 = require("../utils/requestIdManager"); // Import the request ID manager
class ProductService {
    static setRequestId(requestId) {
        (0, requestIdManager_1.setRequestId)(requestId); // Set the request ID in the global manager
    }
    /**
     * Used to extract Product Data from shopify webhook
     * @param{IRequest} req
     * @param{string} productId
     * @param{EVENT_TYPE} eventType
     * @return{IProduct}
     */
    static extractProductDataForIngress(req, productId, eventType, productData) {
        var _a;
        logger_1.logger.info("heelo");
        let body = {};
        body = productData
            ? (0, camelcase_keys_1.default)(productData, { deep: true })
            : (0, camelcase_keys_1.default)(req.body, { deep: true });
        if (eventType === product_1.EVENT_TYPE.DELETE) {
            return {
                productId: (_a = body === null || body === void 0 ? void 0 : body.id) === null || _a === void 0 ? void 0 : _a.toString(),
                eventType,
                companyId: (0, helpers_1.getCompanyId)(this.shopType, req),
                shopType: this.shopType,
                webhookId: (0, helpers_1.getWebhookId)(this.shopType, req),
            };
        }
        const products = [];
        const { variants, images, title, handle, status, productType } = body;
        // TODO: add HSN code
        variants === null || variants === void 0 ? void 0 : variants.forEach((variant) => {
            let variantItem;
            variantItem = {
                _id: productId,
                variantId: variant.id.toString(),
                webhookId: productData
                    ? "add-script-webhook-id"
                    : (0, helpers_1.getWebhookId)(this.shopType, req),
                eventType,
                shopType: this.shopType,
                companyId: productData
                    ? productData.companyId
                    : (0, helpers_1.getCompanyId)(this.shopType, req),
                productTitle: title || "",
                variantTitle: variant.title || "",
                category: productType || "",
                createdAt: new Date(variant.createdAt),
                updatedAt: new Date(variant.updatedAt),
                weight: (0, helpers_1.convertShopifyWeightToGrams)(variant.weightUnit, Number(variant.weight) || 0),
                weightUnit: product_2.WEIGHT_UNIT.GRAM,
                taxable: variant.taxable,
                isActive: status === product_2.SHOPIFY_PRODUCT_STATUS.ACTIVE,
                sku: variant.sku || "",
                skuId: "",
                productId: variant.productId.toString(),
                price: Number(variant.price),
                inventoryQuantity: Number(variant.inventoryQuantity) || 0,
                barcode: variant.barcode || "",
                handle,
                imageUrls: variant.imageId
                    ? images
                        .filter((image) => image.id === variant.imageId)
                        .map((o) => o.src)
                    : [],
                productType: product_2.PRODUCT_TYPE.VARIATION,
                dimensions: {},
            };
            products.push(variantItem);
        });
        return products;
    }
    /**
     *
     * Used to extract Product Data from shopify webhook which is used in ingress and need to move from local shopify service to public repo
     * @param{string} companyId (Login use company Id)
     * @param{EVENT_TYPE} productData (All ProductData array from shopify Products List)
     * @return{IProduct}
     *
     */
    static extractProductData(companyId, productData) {
        let body = {};
        body = (0, camelcase_keys_1.default)(productData, { deep: true });
        const products = [];
        const { variants, images, title, handle, status, productType } = body;
        // // TODO: add HSN code
        variants.forEach((variant) => {
            let variantItem;
            variantItem = {
                variantId: variant.id.toString(),
                shopType: product_2.SHOP_TYPE.SHOPIFY,
                companyId,
                productTitle: title || "",
                variantTitle: variant.title || "",
                category: productType || "",
                createdAt: new Date(variant.createdAt),
                updatedAt: new Date(variant.updatedAt),
                weight: (0, helpers_1.convertShopifyWeightToGrams)(variant.weightUnit, Number(variant.weight) || 0),
                weightUnit: product_2.WEIGHT_UNIT.GRAM,
                taxable: variant.taxable,
                isActive: status === product_2.SHOPIFY_PRODUCT_STATUS.ACTIVE,
                sku: variant.sku || "",
                skuId: "",
                productId: variant.productId.toString(),
                price: Number(variant.price),
                inventoryQuantity: Number(variant.inventoryQuantity) || 0,
                barcode: variant.barcode || "",
                handle,
                imageUrls: variant.imageId
                    ? images
                        .filter((image) => image.id === variant.imageId)
                        .map((o) => o.src)
                    : [],
                productType: product_2.PRODUCT_TYPE.VARIATION,
                dimensions: {},
            };
            products.push(variantItem);
        });
        return products;
    }
    /**
     * This Function is used to get all products from shopify
     * @param shopifyInstance (Shopify config Instance)
     * @returns Shopify Products List
     *
     */
    static async getProductList(shopifyInstance) {
        try {
            let params = { limit: product_2.DEFAULT_PAGINATION_LIMIT_SHOPIFY_PRODUCT_LIST };
            let productLists = [];
            do {
                // const products = await shopifyInstance.product.list({
                //   ...params,
                //   fields: `id,variants,images,title,handle,status,productType`,
                // });
                const products = await shopify_1.default.getAllProductList(shopifyInstance, params.limit);
                productLists = productLists.concat(products);
                params = products.nextPageParameters;
            } while (params !== undefined);
            return productLists;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * This Function is used to get order detail from shopify
     * @param shopifyInstance (Shopify config Instance)
     * @param orderId (orderId) (External Order Id)
     *
     * @returns Shopify Order Detail
     *
     */
    static async getOrderDetail(shopifyInstance, orderId) {
        try {
            return shopify_1.default.getOrderData(shopifyInstance, String(orderId));
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Extract useful info from the address
     * @param addressObject
     * @param customerDetails
     * @return {IAddress}
     */
    static getAddress(addressObject, customerDetails) {
        var _a, _b, _c, _d, _e, _f;
        if ((addressObject === null || addressObject === void 0 ? void 0 : addressObject.lastName) && !(addressObject === null || addressObject === void 0 ? void 0 : addressObject.firstName)) {
            addressObject.firstName = addressObject.lastName;
            addressObject.lastName = "";
        }
        return {
            firstName: addressObject === null || addressObject === void 0 ? void 0 : addressObject.firstName,
            lastName: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.lastName) || "",
            email: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.email) || (customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.email) || "",
            phone: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.phone) || (customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.phone) || "",
            address1: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.address1) ||
                ((_a = customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.defaultAddress) === null || _a === void 0 ? void 0 : _a.address1) ||
                "",
            address2: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.address2) ||
                ((_b = customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.defaultAddress) === null || _b === void 0 ? void 0 : _b.address2) ||
                "",
            city: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.city) || ((_c = customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.defaultAddress) === null || _c === void 0 ? void 0 : _c.city) || "",
            state: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.province) ||
                ((_d = customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.defaultAddress) === null || _d === void 0 ? void 0 : _d.province) ||
                "",
            country: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.country) ||
                ((_e = customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.defaultAddress) === null || _e === void 0 ? void 0 : _e.country) ||
                "",
            pincode: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.zip) || ((_f = customerDetails === null || customerDetails === void 0 ? void 0 : customerDetails.defaultAddress) === null || _f === void 0 ? void 0 : _f.zip) || "",
            company: (addressObject === null || addressObject === void 0 ? void 0 : addressObject.company) || "",
        };
    }
}
exports.default = ProductService;
ProductService.shopType = product_2.SHOP_TYPE.SHOPIFY;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Byb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBMkM7QUFDM0MsOENBSzBCO0FBQzFCLDhDQU8wQjtBQUMxQix3Q0FJb0I7QUFFcEIsd0RBQXVDO0FBQ3ZDLHNDQUFtQztBQUNuQyxnRUFBeUQsQ0FBQyxnQ0FBZ0M7QUFHMUYsTUFBcUIsY0FBYztJQUlqQyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQWlCO1FBQ25DLElBQUEsK0JBQVksRUFBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLDJDQUEyQztJQUN0RSxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QixDQUN4QyxHQUFRLEVBQ1IsU0FBaUIsRUFDakIsU0FBcUIsRUFDckIsV0FBaUI7O1FBRWpCLGVBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsSUFBSSxJQUFJLEdBQVEsRUFBRSxDQUFDO1FBQ25CLElBQUksR0FBRyxXQUFXO1lBQ2hCLENBQUMsQ0FBQyxJQUFBLHdCQUFhLEVBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO1lBQzVDLENBQUMsQ0FBQyxJQUFBLHdCQUFhLEVBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksU0FBUyxLQUFLLG9CQUFVLENBQUMsTUFBTSxFQUFFO1lBQ25DLE9BQU87Z0JBQ0wsU0FBUyxFQUFFLE1BQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEVBQUUsMENBQUUsUUFBUSxFQUFFO2dCQUMvQixTQUFTO2dCQUNULFNBQVMsRUFBRSxJQUFBLHNCQUFZLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7Z0JBQzNDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtn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