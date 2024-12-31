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
        variants === null || variants === void 0 ? void 0 : variants.edges.forEach((v) => {
            var _a, _b, _c, _d, _e, _f;
            let variantItem;
            const variant = v.node;
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
                weight: (0, helpers_1.convertShopifyWeightToGrams)((_c = (_b = (_a = variant === null || variant === void 0 ? void 0 : variant.inventoryItem) === null || _a === void 0 ? void 0 : _a.measurement) === null || _b === void 0 ? void 0 : _b.weight) === null || _c === void 0 ? void 0 : _c.unit, Number((_f = (_e = (_d = variant === null || variant === void 0 ? void 0 : variant.inventoryItem) === null || _d === void 0 ? void 0 : _d.measurement) === null || _e === void 0 ? void 0 : _e.weight) === null || _f === void 0 ? void 0 : _f.value) || 0),
                weightUnit: product_2.WEIGHT_UNIT.GRAM,
                taxable: variant.taxable,
                isActive: status === product_2.SHOPIFY_PRODUCT_STATUS.ACTIVE,
                sku: variant.sku || "",
                skuId: "",
                productId: variant.product.id.toString(),
                price: Number(variant.price),
                inventoryQuantity: Number(variant.inventoryQuantity) || 0,
                barcode: variant.barcode || "",
                handle,
                imageUrls: variant.image.id
                    ? images === null || images === void 0 ? void 0 : images.edges.filter((image) => image.node.id === variant.image.id).map((o) => o.src)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Byb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBMkM7QUFDM0MsOENBSzBCO0FBQzFCLDhDQU8wQjtBQUMxQix3Q0FJb0I7QUFFcEIsd0RBQXVDO0FBRXZDLE1BQXFCLGNBQWM7SUFHakM7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLDRCQUE0QixDQUN4QyxHQUFRLEVBQ1IsU0FBaUIsRUFDakIsU0FBcUIsRUFDckIsV0FBaUI7O1FBRWpCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQztRQUNuQixJQUFJLEdBQUcsV0FBVztZQUNoQixDQUFDLENBQUMsSUFBQSx3QkFBYSxFQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUM1QyxDQUFDLENBQUMsSUFBQSx3QkFBYSxFQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUM1QyxJQUFJLFNBQVMsS0FBSyxvQkFBVSxDQUFDLE1BQU0sRUFBRTtZQUNuQyxPQUFPO2dCQUNMLFNBQVMsRUFBRSxNQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxFQUFFLDBDQUFFLFFBQVEsRUFBRTtnQkFDL0IsU0FBUztnQkFDVCxTQUFTLEVBQUUsSUFBQSxzQkFBWSxFQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO2dCQUMzQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0JBQ3ZCLFNBQVMsRUFBRSxJQUFBLHNCQUFZLEVBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUM7YUFDNUMsQ0FBQztTQUNIO1FBQ0QsTUFBTSxRQUFRLEdBQWUsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxF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