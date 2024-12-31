import Shopify, { ITransaction } from "shopify-api-node";
import ShopifyService from "../src/apis/shopify";

jest.setTimeout(1000);

// cancelOrderFulfillment
describe("cancelOrderFulfillment", () => {
  it("Cancel Order Fulfillment", async () => {
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

    const mockCreateTransaction = jest.spyOn(
      ShopifyService,
      "createTransactionAtShopify"
    );
    mockCreateTransaction.mockResolvedValue({} as ITransaction);

    const orderId = "4b5ab279-66fb-45ad-98e5-63b330f44492";
    const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
    const amount = 10000;
    const responseCancelFulfillment = await ShopifyService.markCODOrderAsPaid(
      orderId,
      userId,
      amount
    );

    expect(responseCancelFulfillment).toStrictEqual({});
  });
});
