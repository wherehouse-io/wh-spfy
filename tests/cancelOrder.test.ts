import Shopify, { IOrder } from "shopify-api-node";
import ShopifyService from "../src/apis/shopify";

jest.setTimeout(1000);

// cancelOrder
describe("cancelOrder", () => {
  it("Cancel Order", async () => {
    const mockAxios = jest.spyOn(ShopifyService, "getShopifyInstance");
    mockAxios.mockReturnValue(
      Promise.resolve(
        new Shopify({
          shopName: "test",
          apiKey: "test",
          password: "test",
        })
      )
    );

    const mockCancelOrder = jest.spyOn(ShopifyService, "cancelOrder");
    mockCancelOrder.mockResolvedValue(true);

    const orderId = "4b5ab279-66fb-45ad-98e5-63b330f44492";
    const responseCancelOrder = await ShopifyService.cancelOrder(
      {
        shopName: "test",
        apiKey: "test",
        password: "test",
      },
      orderId
    );

    expect(responseCancelOrder).toStrictEqual({});
  });
});
