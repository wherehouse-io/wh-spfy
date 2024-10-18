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
            }, "2024-10")}/graphql.json`;
            const errorWebhooks = [];
            logger_1.logger.info(`!!!!!Register Webhook started!!!!!! ${JSON.stringify(data, null, 2)}`);
            const SHOPIFY_WEBHOOKS = this.getShopifyWebhooks();
            for (const hook of SHOPIFY_WEBHOOKS) {
                logger_1.logger.info(`!!!!!Processing!!!!!! ${hook.topic}`);
                const Response = await this.callRegisterWebhook(apiUrl, hook, key, secret);
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
    static async callRegisterWebhook(apiUrl, hook, key, secret) {
        const WEBHOOK_MUTATION = ` mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $address: URL!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: {callbackUrl: $address, format: JSON}) {
          userErrors {
            field
            message
          }
          webhookSubscription {
            id
          }
        }
      }
    `;
        const config = {
            auth: {
                username: key,
                password: secret,
            },
            headers: {
                "Content-Type": "application/json",
            },
        };
        return axios_1.default.post(apiUrl, {
            query: WEBHOOK_MUTATION,
            variables: {
                topic: hook.topic.toUpperCase(),
                address: hook.address,
            },
        }, config);
    }
}
exports.default = WebhookService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0NBQStDO0FBQy9DLHNDQUFtQztBQUVuQyxNQUFxQixjQUFjO0lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFJN0I7O1FBQ0MsSUFBSTtZQUNGLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUNuQyxNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUEsMkJBQWlCLEVBQ2pDO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFFBQVEsRUFBRSxNQUFNO2FBQ2pCLEVBQ0QsU0FBUyxDQUNWLGVBQWUsQ0FBQztZQUNqQixNQUFNLGFBQWEsR0FBUSxFQUFFLENBQUM7WUFDOUIsZUFBTSxDQUFDLElBQUksQ0FDVCx1Q0FBdUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQ3ZFLENBQUM7WUFFRixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBRW5ELEtBQUssTUFBTSxJQUFJLElBQUksZ0JBQWdCLEVBQUU7Z0JBQ25DLGVBQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNuRCxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FDN0MsTUFBTSxFQUNOLElBQUksRUFDSixHQUFHLEVBQ0gsTUFBTSxDQUNQLENBQUM7Z0JBRUYsSUFBSSxDQUFDLENBQUEsTUFBQSxNQUFBLFFBQVEsYUFBUixRQUFRLHVCQUFSLFFBQVEsQ0FBRSxJQUFJLDBDQUFFLE9BQU8sMENBQUUsRUFBRSxDQUFBLEVBQUU7b0JBQ2hDLGVBQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUN0RCxhQUFhLENBQUMsSUFBSSxDQUFDO3dCQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7d0JBQ2pCLElBQUk7d0JBQ0osT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO3FCQUN0QixDQUFDLENBQUM7aUJBQ0o7cUJBQU07b0JBQ0wsZUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ25EO2FBQ0Y7WUFFRCxPQUFPO2dCQUNMLE9BQU8sRUFBRSx3Q0FBd0M7Z0JBQ2pELGFBQWE7YUFDZCxDQUFDO1NBQ0g7UUFBQyxPQUFPLEtBQVUsRUFBRTtZQUNuQixNQUFNLEtBQUssQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxrQkFBa0I7UUFDdkIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDakQ7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUM5QixNQUFjLEVBQ2QsSUFBUyxFQUNULEdBQVcsRUFDWCxNQUFjO1FBRWQsTUFBTSxnQkFBZ0IsR0FBRzs7Ozs7Ozs7Ozs7S0FXeEIsQ0FBQztRQUVGLE1BQU0sTUFBTSxHQUFHO1lBQ2IsSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxHQUFHO2dCQUNiLFFBQVEsRUFBRSxNQUFNO2FBQ2pCO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxrQkFBa0I7YUFDbkM7U0FDRixDQUFDO1FBRUYsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUNmLE1BQU0sRUFDTjtZQUNFLEtBQUssRUFBRSxnQkFBZ0I7WUFDdkIsU0FBUyxFQUFFO2dCQUNULEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtnQkFDL0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3RCO1NBQ0YsRUFDRCxNQUFNLENBQ1AsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXRHRCxpQ0FzR0MifQ==