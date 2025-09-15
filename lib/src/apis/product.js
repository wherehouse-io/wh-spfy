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
class ProductService {
    /**
     * Used to extract Product Data from shopify webhook
     * @param{IRequest} req
     * @param{string} productId
     * @param{EVENT_TYPE} eventType
     * @return{IProduct}
     */
    static extractProductDataForIngress(req, productId, eventType, productData) {
        var _a;
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
                    : images[0].src,
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
            let hasNextPage = true;
            while (hasNextPage) {
                // const products = await shopifyInstance.product.list({
                //   ...params,
                //   fields: `id,variants,images,title,handle,status,productType`,
                // });
                const products = await shopify_1.default.getAllProductList(shopifyInstance, params.limit);
                productLists = productLists.concat(products);
                hasNextPage = products.hasNextPage || false;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Byb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBMkM7QUFDM0MsOENBSzBCO0FBQzFCLDhDQU8wQjtBQUMxQix3Q0FJb0I7QUFFcEIsd0RBQXVDO0FBRXZDLE1BQXFCLGNBQWM7SUFHakM7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QixDQUN4QyxHQUFRLEVBQ1IsU0FBaUIsRUFDakIsU0FBcUIsRUFDckIsV0FBaUI7O1FBRWpCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztRQUNuQixJQUFJLEdBQUcsV0FBVztZQUNoQixDQUFDLENBQUMsSUFBQSx3QkFBYSxFQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUM1QyxDQUFDLENBQUMsSUFBQSx3QkFBYSxFQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM1QyxJQUFJLFNBQVMsS0FBSyxvQkFBVSxDQUFDLE1BQU0sRUFBRTtZQUNuQyxPQUFPO2dCQUNMLFNBQVMsRUFBRSxNQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxFQUFFLDBDQUFFLFFBQVEsRUFBRTtnQkFDL0IsU0FBUztnQkFDVCxTQUFTLEVBQUUsSUFBQSxzQkFBWSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO2dCQUMzQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLFNBQVMsRUFBRSxJQUFBLHNCQUFZLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7YUFDNUMsQ0FBQztTQUNIO1FBQ0QsTUFBTSxRQUFRLEdBQWUsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxF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