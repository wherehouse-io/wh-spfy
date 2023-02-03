import { AxiosResponse } from "axios";
import WebhookService from "../src/apis/webhook";

jest.setTimeout(1000);

// registerWebhooks
describe("registerWebhooks", () => {
  it("Registering webhooks", async () => {
    const mockAxiosListFulFillment = jest.spyOn(
      WebhookService,
      "callRegisterWebhook"
    );
    const dataResponse: AxiosResponse = {
      data: {
        webhook: {
          id: "1",
        },
      },
      status: 200,
      statusText: "Success",
      headers: "",
      config: {},
    };
    mockAxiosListFulFillment.mockReturnValue(Promise.resolve(dataResponse));

    const mockGetShopify = jest.spyOn(WebhookService, "getShopifyWebhooks");
    mockGetShopify.mockReturnValue([
      {
        topic: "topic",
        address: "address",
      },
    ]);

    const response = await WebhookService.registerWebhooks({
      key: "key",
      secret: "secret",
      shop: "shop",
    });

    expect(response.message).toBe("Successfully created all Shopify Hooks");
  });
});
