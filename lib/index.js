"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = exports.FulfillmentService = exports.ShopifyService = exports.WebhookService = void 0;
const webhook_1 = __importDefault(require("./src/apis/webhook"));
exports.WebhookService = webhook_1.default;
const shopify_1 = __importDefault(require("./src/apis/shopify"));
exports.ShopifyService = shopify_1.default;
const fulfillment_1 = __importDefault(require("./src/apis/fulfillment"));
exports.FulfillmentService = fulfillment_1.default;
const product_1 = __importDefault(require("./src/apis/product"));
exports.ProductService = product_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxpRUFBZ0Q7QUFLdkMseUJBTEYsaUJBQWMsQ0FLRTtBQUp2QixpRUFBZ0Q7QUFJdkIseUJBSmxCLGlCQUFjLENBSWtCO0FBSHZDLHlFQUF3RDtBQUdmLDZCQUhsQyxxQkFBa0IsQ0FHa0M7QUFGM0QsaUVBQWdEO0FBRWEseUJBRnRELGlCQUFjLENBRXNEIn0=