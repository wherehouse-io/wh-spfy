import axios from "axios";
import { getShopifyBaseUrl } from "../helpers";
import { logger } from "../logger";
import { WEBHOOK_MUTATION } from "../helpers/graphql/mutations";

export default class WebhookService {
  static async registerWebhooks(data: {
    key: string;
    secret: string;
    shop: string;
  }) {
    try {
      const { shop, key, secret } = data;
      const apiUrl = `${getShopifyBaseUrl({
        shopName: shop,
        apiKey: key,
        password: secret,
      })}/graphql.json`;
      const errorWebhooks: any = [];
      logger.info(
        `!!!!!Register Webhook started!!!!!! ${JSON.stringify(data, null, 2)}`
      );

      const SHOPIFY_WEBHOOKS = this.getShopifyWebhooks();

      for (const hook of SHOPIFY_WEBHOOKS) {
        logger.info(`!!!!!Processing!!!!!! ${hook.topic}`);
        const Response = await this.callRegisterWebhook(apiUrl, hook, secret);

        if (
          !Response?.data?.data?.webhookSubscriptionCreate?.webhookSubscription
            ?.id
        ) {
          logger.info(`!!!!!Not Completed!!!!!! ${hook.topic}`);
          errorWebhooks.push({
            topic: hook.topic,
            shop,
            address: hook.address,
          });
        } else {
          logger.info(`!!!!!Completed!!!!!! ${hook.topic}`);
        }
      }

      return {
        message: "Successfully created all Shopify Hooks",
        errorWebhooks,
      };
    } catch (error: any) {
      throw error;
    }
  }

  static getShopifyWebhooks() {
    if (process.env.SHOPIFY_WEBHOOKS) {
      return JSON.parse(process.env.SHOPIFY_WEBHOOKS);
    }

    return [];
  }

  static async callRegisterWebhook(apiUrl: string, hook: any, secret: string) {
    return axios.post(
      apiUrl,
      {
        query: WEBHOOK_MUTATION,
        variables: {
          topic: hook.topic,
          address: hook.address,
        },
      },
      {
        headers: {
          "X-Shopify-Access-Token": secret,
        },
      }
    );
  }
}
