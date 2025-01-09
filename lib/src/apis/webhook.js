"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("../helpers");
const logger_1 = require("../logger");
const mutations_1 = require("../helpers/graphql/mutations");
class WebhookService {
    static async registerWebhooks(data) {
        var _a, _b;
        try {
            const { shop, key, secret } = data;
            const apiUrl = `${(0, helpers_1.getShopifyBaseUrl)({
                shopName: shop,
                apiKey: key,
                password: secret,
            })}/graphql.json`;
            const errorWebhooks = [];
            logger_1.logger.info(`!!!!!Register Webhook started!!!!!! ${JSON.stringify(data, null, 2)}`);
            const SHOPIFY_WEBHOOKS = this.getShopifyWebhooks();
            for (const hook of SHOPIFY_WEBHOOKS) {
                logger_1.logger.info(`!!!!!Processing!!!!!! ${hook.topic}`);
                const Response = await this.callRegisterWebhook(apiUrl, hook, secret);
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
    static async callRegisterWebhook(apiUrl, hook, secret) {
        return axios_1.default.post(apiUrl, {
            query: mutations_1.WEBHOOK_MUTATION,
            variables: {
                topic: hook.topic.toUpperCase(),
                address: hook.address,
            },
        }, {
            headers: {
                "X-Shopify-Access-Token": secret,
            },
        });
    }
}
exports.default = WebhookService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0NBQStDO0FBQy9DLHNDQUFtQztBQUNuQyw0REFBZ0U7QUFFaEUsTUFBcUIsY0FBYztJQUNqQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLElBSTdCOztRQUNDLElBQUk7WUFDRixNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDbkMsTUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFBLDJCQUFpQixFQUFDO2dCQUNsQyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsR0FBRztnQkFDWCxRQUFRLEVBQUUsTUFBTTthQUNqQixDQUFDLGVBQWUsQ0FBQztZQUNsQixNQUFNLGFBQWEsR0FBUSxFQUFFLENBQUM7WUFDOUIsZUFBTSxDQUFDLElBQUksQ0FDVCx1Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQ3ZFLENBQUM7WUFFRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRW5ELEtBQUssTUFBTSxJQUFJLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ25DLGVBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUV0RSxJQUFJLENBQUMsQ0FBQSxNQUFBLE1BQUEsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLElBQUksMENBQUUsT0FBTywwQ0FBRSxFQUFFLENBQUEsRUFBRTtvQkFDaEMsZUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3RELGFBQWEsQ0FBQyxJQUFJLENBQUM7d0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzt3QkFDakIsSUFBSTt3QkFDSixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87cUJBQ3RCLENBQUMsQ0FBQztpQkFDSjtxQkFBTTtvQkFDTCxlQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDbkQ7YUFDRjtZQUVELE9BQU87Z0JBQ0wsT0FBTyxFQUFFLHdDQUF3QztnQkFDakQsYUFBYTthQUNkLENBQUM7U0FDSDtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLGtCQUFrQjtRQUN2QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNqRDtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsTUFBYyxFQUFFLElBQVMsRUFBRSxNQUFjO1FBQ3hFLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FDZixNQUFNLEVBQ047WUFDRSxLQUFLLEVBQUUsNEJBQWdCO1lBQ3ZCLFNBQVMsRUFBRTtnQkFDVCxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7Z0JBQy9CLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTzthQUN0QjtTQUNGLEVBQ0Q7WUFDRSxPQUFPLEVBQUU7Z0JBQ1Asd0JBQXdCLEVBQUUsTUFBTTthQUNqQztTQUNGLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXRFRCxpQ0FzRUMifQ==