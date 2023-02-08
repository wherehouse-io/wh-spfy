"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("../helpers");
const logger_1 = require("../logger");
class WebhookService {
    static async registerWebhooks(data) {
        var _a, _b;
        try {
            const { shop, key, secret } = data;
            const apiUrl = `${(0, helpers_1.getShopifyBaseUrl)({
                shopName: shop,
                apiKey: key,
                password: secret,
            }, "2022-10")}webhooks.json`;
            const errorWebhooks = [];
            logger_1.logger.info(`!!!!!Register Webhook started!!!!!! ${JSON.stringify(data, null, 2)}`);
            const SHOPIFY_WEBHOOKS = this.getShopifyWebhooks();
            for (const hook of SHOPIFY_WEBHOOKS) {
                logger_1.logger.info(`!!!!!Processing!!!!!! ${hook.topic}`);
                const Response = await this.callRegisterWebhook(apiUrl, hook);
                if (!((_b = (_a = Response === null || Response === void 0 ? void 0 : Response.data) === null || _a === void 0 ? void 0 : _a.webhook) === null || _b === void 0 ? void 0 : _b.id)) {
                    logger_1.logger.info(`!!!!!Not Completed!!!!!! ${hook.topic}`);
                    errorWebhooks.push({
                        topic: hook.topic,
                        shop,
                        address: hook.address,
                    });
                }
                else {
                    logger_1.logger.info(`!!!!!Completed!!!!!! ${hook.topic}`);
                }
            }
            return {
                message: "Successfully created all Shopify Hooks",
                errorWebhooks,
            };
        }
        catch (error) {
            throw error;
        }
    }
    static getShopifyWebhooks() {
        if (process.env.SHOPIFY_WEBHOOKS) {
            return JSON.parse(process.env.SHOPIFY_WEBHOOKS);
        }
        return [];
    }
    static async callRegisterWebhook(apiUrl, hook) {
        return axios_1.default.post(apiUrl, {
            webhook: {
                topic: hook.topic,
                address: hook.address,
                format: "json",
            },
        });
    }
}
exports.default = WebhookService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0NBQStDO0FBQy9DLHNDQUFtQztBQUVuQyxNQUFxQixjQUFjO0lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFJN0I7O1FBQ0MsSUFBSTtZQUNGLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUNuQyxNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUEsMkJBQWlCLEVBQ2pDO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFFBQVEsRUFBRSxNQUFNO2FBQ2pCLEVBQ0QsU0FBUyxDQUNWLGVBQWUsQ0FBQztZQUNqQixNQUFNLGFBQWEsR0FBUSxFQUFFLENBQUM7WUFDOUIsZUFBTSxDQUFDLElBQUksQ0FDVCx1Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQ3ZFLENBQUM7WUFFRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRW5ELEtBQUssTUFBTSxJQUFJLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ25DLGVBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRTlELElBQUksQ0FBQyxDQUFBLE1BQUEsTUFBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSSwwQ0FBRSxPQUFPLDBDQUFFLEVBQUUsQ0FBQSxFQUFFO29CQUNoQyxlQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDdEQsYUFBYSxDQUFDLElBQUksQ0FBQzt3QkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNqQixJQUFJO3dCQUNKLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztxQkFDdEIsQ0FBQyxDQUFDO2lCQUNKO3FCQUFNO29CQUNMLGVBQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUNuRDthQUNGO1lBRUQsT0FBTztnQkFDTCxPQUFPLEVBQUUsd0NBQXdDO2dCQUNqRCxhQUFhO2FBQ2QsQ0FBQztTQUNIO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCO1FBQ3ZCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsSUFBUztRQUN4RCxPQUFPLGVBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3hCLE9BQU8sRUFBRTtnQkFDUCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztnQkFDckIsTUFBTSxFQUFFLE1BQU07YUFDZjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpFRCxpQ0FpRUMifQ==