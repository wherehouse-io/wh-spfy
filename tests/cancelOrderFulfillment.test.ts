import Shopify, { IFulfillment, IOrderFulfillment } from "shopify-api-node";
import ShopifyService from "../src/apis/shopify";

jest.setTimeout(1000);

// cancelOrderFulfillment
describe("cancelOrderFulfillment", () => {
  it("Cancel Order Fulfillment", async () => {
    const mockAxiosUrl = jest.spyOn(ShopifyService, "getShopifyUrlInstance");
    mockAxiosUrl.mockReturnValue(
      Promise.resolve({
        shopName: "test",
        apiKey: "test",
        password: "test",
      })
    );

    const mockGetWherehouseFulfillment = jest.spyOn(
      ShopifyService,
      "getWherehouseFulfillment"
    );
    mockGetWherehouseFulfillment.mockResolvedValue({} as IOrderFulfillment);

    const mockCancelFulfillment = jest.spyOn(
      ShopifyService,
      "cancelFulfillment"
    );
    mockCancelFulfillment.mockResolvedValue({} as IFulfillment);

    const orderId = "4b5ab279-66fb-45ad-98e5-63b330f44492";
    const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
    const responseCancelFulfillment =
      await ShopifyService.cancelOrderFulfillment(orderId, userId);

    expect(responseCancelFulfillment).toStrictEqual({});
  });
});
