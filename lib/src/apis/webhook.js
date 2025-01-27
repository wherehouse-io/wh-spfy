"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("../helpers");
const logger_1 = require("../logger");
const mutations_1 = require("../helpers/graphql/mutations");
const requestIdManager_1 = require("../utils/requestIdManager");
class WebhookService {
    static setRequestId(requestId) {
        (0, requestIdManager_1.setRequestId)(requestId); // Set the request ID in the global manager
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3dlYmhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsd0NBQStDO0FBQy9DLHNDQUFtQztBQUNuQyw0REFBZ0U7QUFDaEUsZ0VBQXlEO0FBRXpELE1BQXFCLGNBQWM7SUFDakMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFpQjtRQUNuQyxJQUFBLCtCQUFZLEVBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQywyQ0FBMkM7SUFDdEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsSUFJN0I7O1FBQ0MsSUFBSTtZQUNGLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUNuQyxNQUFNLE1BQU0sR0FBRyxHQUFHLElBQUEsMkJBQWlCLEVBQUM7Z0JBQ2xDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxHQUFHO2dCQUNYLFFBQVEsRUFBRSxNQUFNO2FBQ2pCLENBQUMsZUFBZSxDQUFDO1lBQ2xCLE1BQU0sYUFBYSxHQUFRLEVBQUUsQ0FBQztZQUM5QixlQUFNLENBQUMsSUFBSSxDQUNULHVDQUF1QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FDdkUsQ0FBQztZQUVGLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFFbkQsS0FBSyxNQUFNLElBQUksSUFBSSxnQkFBZ0IsRUFBRTtnQkFDbkMsZUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBRXRFLElBQUksQ0FBQyxDQUFBLE1BQUEsTUFBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsSUFBSSwwQ0FBRSxPQUFPLDBDQUFFLEVBQUUsQ0FBQSxFQUFFO29CQUNoQyxlQUFNLENBQUMsSUFBSSxDQUFDLDRCQUE0QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDdEQsYUFBYSxDQUFDLElBQUksQ0FBQzt3QkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNqQixJQUFJO3dCQUNKLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztxQkFDdEIsQ0FBQyxDQUFDO2lCQUNKO3FCQUFNO29CQUNMLGVBQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUNuRDthQUNGO1lBRUQsT0FBTztnQkFDTCxPQUFPLEVBQUUsd0NBQXdDO2dCQUNqRCxhQUFhO2FBQ2QsQ0FBQztTQUNIO1FBQUMsT0FBTyxLQUFVLEVBQUU7WUFDbkIsTUFBTSxLQUFLLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsa0JBQWtCO1FBQ3ZCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1NBQ2pEO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFjLEVBQUUsSUFBUyxFQUFFLE1BQWM7UUFDeEUsT0FBTyxlQUFLLENBQUMsSUFBSSxDQUNmLE1BQU0sRUFDTjtZQUNFLEtBQUssRUFBRSw0QkFBZ0I7WUFDdkIsU0FBUyxFQUFFO2dCQUNULEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtnQkFDL0IsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO2FBQ3RCO1NBQ0YsRUFDRDtZQUNFLE9BQU8sRUFBRTtnQkFDUCx3QkFBd0IsRUFBRSxNQUFNO2FBQ2pDO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBMUVELGlDQTBFQyJ9