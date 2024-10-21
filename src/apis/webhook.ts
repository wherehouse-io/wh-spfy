import axios from "axios";
import { getShopifyBaseUrl } from "../helpers";
import { logger } from "../logger";

export default class WebhookService {
  static async registerWebhooks(data: {
    key: string;
    secret: string;
    shop: string;
  }) {
    try {
      const { shop, key, secret } = data;
      const apiUrl = `${getShopifyBaseUrl(
        {
          shopName: shop,
          apiKey: key,
          password: secret,
        },
        "2024-10"
      )}/graphql.json`;
      const errorWebhooks: any = [];
      logger.info(
        `!!!!!Register Webhook started!!!!!! ${JSON.stringify(data, null, 2)}`
      );

      const SHOPIFY_WEBHOOKS = this.getShopifyWebhooks();

      for (const hook of SHOPIFY_WEBHOOKS) {
        logger.info(`!!!!!Processing!!!!!! ${hook.topic}`);
        const Response = await this.callRegisterWebhook(
          apiUrl,
          hook,
          key,
          secret
        );

        if (!Response?.data?.webhook?.id) {
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

  static async callRegisterWebhook(
    apiUrl: string,
    hook: any,
    key: string,
    secret: string
  ) {
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

    return axios.post(
      apiUrl,
      {
        query: WEBHOOK_MUTATION,
        variables: {
          topic: hook.topic.toUpperCase(),
          address: hook.address,
        },
      },
      config
    );
  }
}
