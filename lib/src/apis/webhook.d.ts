export default class WebhookService {
    static registerWebhooks(data: {
        key: string;
        secret: string;
        shop: string;
    }): Promise<{
        message: string;
        errorWebhooks: any;
    }>;
    static getShopifyWebhooks(): any;
    static callRegisterWebhook(apiUrl: string, hook: any, key: string, secret: string): Promise<import("axios").AxiosResponse<any>>;
}
