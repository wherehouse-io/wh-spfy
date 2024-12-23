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
            })}/graphql.json`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0NBQStDO0FBQy9DLHNDQUFtQztBQUVuQyxNQUFxQixjQUFjO0lBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFJN0I7O1FBQ0MsSUFBSTtZQUNGLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUNuQyxNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUEsMkJBQWlCLEVBQ2pDO2dCQUNFLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFFBQVEsRUFBRSxNQUFNO2FBQ2pCLENBQ0YsZUFBZSxDQUFDO1lBQ2pCLE1BQU0sYUFBYSxHQUFRLEVBQUUsQ0FBQztZQUM5QixlQUFNLENBQUMsSUFBSSxDQUNULHVDQUF1QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDdkUsQ0FBQztZQUVGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFbkQsS0FBSyxNQUFNLElBQUksSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbkMsZUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUM3QyxNQUFNLEVBQ04sSUFBSSxFQUNKLEdBQUcsRUFDSCxNQUFNLENBQ1AsQ0FBQztnQkFFRixJQUFJLENBQUMsQ0FBQSxNQUFBLE1BQUEsUUFBUSxhQUFSLFFBQVEsdUJBQVIsUUFBUSxDQUFFLElBQUksMENBQUUsT0FBTywwQ0FBRSxFQUFFLENBQUEsRUFBRTtvQkFDaEMsZUFBTSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7b0JBQ3RELGFBQWEsQ0FBQyxJQUFJLENBQUM7d0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzt3QkFDakIsSUFBSTt3QkFDSixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87cUJBQ3RCLENBQUMsQ0FBQztpQkFDSjtxQkFBTTtvQkFDTCxlQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDbkQ7YUFDRjtZQUVELE9BQU87Z0JBQ0wsT0FBTyxFQUFFLHdDQUF3QztnQkFDakQsYUFBYTthQUNkLENBQUM7U0FDSDtRQUFDLE9BQU8sS0FBVSxFQUFFO1lBQ25CLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLGtCQUFrQjtRQUN2QixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNqRDtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQzlCLE1BQWMsRUFDZCxJQUFTLEVBQ1QsR0FBVyxFQUNYLE1BQWM7UUFFZCxNQUFNLGdCQUFnQixHQUFHOzs7Ozs7Ozs7OztLQVd4QixDQUFDO1FBRUYsTUFBTSxNQUFNLEdBQUc7WUFDYixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLE1BQU07YUFDakI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztTQUNGLENBQUM7UUFFRixPQUFPLGVBQUssQ0FBQyxJQUFJLENBQ2YsTUFBTSxFQUNOO1lBQ0UsS0FBSyxFQUFFLGdCQUFnQjtZQUN2QixTQUFTLEVBQUU7Z0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFO2dCQUMvQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEI7U0FDRixFQUNELE1BQU0sQ0FDUCxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBckdELGlDQXFHQyJ9