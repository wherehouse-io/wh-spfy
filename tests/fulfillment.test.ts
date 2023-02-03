import Shopify from "shopify-api-node";
import FulfillmentService from "../src/apis/fulfillment";
import ShopifyService from "../src/apis/shopify";

jest.setTimeout(1000);

// isAlreadyFulfilledOnShopify
describe("isAlreadyFulfilledOnShopify", () => {
  it("Fulfillment is not there", async () => {
    const mockAxios = jest.spyOn(ShopifyService, "getShopifyUrlInstance");
    mockAxios.mockReturnValue(
      Promise.resolve({
        shopName: "test",
        apiKey: "test",
        password: "test",
      })
    );

    const mockAxiosListFulFillment = jest.spyOn(
      FulfillmentService,
      "getFulFillmentListDetails"
    );
    mockAxiosListFulFillment.mockReturnValue(Promise.resolve([]));

    const orderId = "5087501320431";
    const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
    const response = await FulfillmentService.isAlreadyFulfilledOnShopify(
      orderId,
      userId
    );

    expect(response.fulfilled).toBe(false);
  });

  it("Fulfillment is there but fulfilled by wherehouse", async () => {
    const mockAxios = jest.spyOn(ShopifyService, "getShopifyUrlInstance");
    mockAxios.mockReturnValue(
      Promise.resolve({
        shopName: "test",
        apiKey: "test",
        password: "test",
      })
    );

    const mockAxiosListFulFillment = jest.spyOn(
      FulfillmentService,
      "getFulFillmentListDetails"
    );
    mockAxiosListFulFillment.mockReturnValue(
      Promise.resolve([
        {
          created_at: "",
          id: 1,
          line_items: [],
          notify_customer: true,
          order_id: 1,
          receipt: {
            textcase: true,
            authorization: "",
          },
          service: "",
          shipment_status: null,
          status: "success",
          tracking_company: "Wherehouse",
          tracking_numbers: [],
          tracking_url: "",
          tracking_urls: [],
          updated_at: "",
          variant_inventory_management: "",
        },
      ])
    );

    const orderId = "5087501320431";
    const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
    const response = await FulfillmentService.isAlreadyFulfilledOnShopify(
      orderId,
      userId
    );

    expect(response.fulfilled).toBe(true);
    expect(response.fulfilledBy).toBe("Wherehouse");
  });

  it("Fulfillment is there but not fulfilled by wherehouse", async () => {
    const mockAxios = jest.spyOn(ShopifyService, "getShopifyUrlInstance");
    mockAxios.mockReturnValue(
      Promise.resolve({
        shopName: "test",
        apiKey: "test",
        password: "test",
      })
    );

    const mockAxiosListFulFillment = jest.spyOn(
      FulfillmentService,
      "getFulFillmentListDetails"
    );
    mockAxiosListFulFillment.mockReturnValue(
      Promise.resolve([
        {
          created_at: "",
          id: 1,
          line_items: [],
          notify_customer: true,
          order_id: 1,
          receipt: {
            textcase: true,
            authorization: "",
          },
          service: "",
          shipment_status: null,
          status: "success",
          tracking_company: "Xpressbees",
          tracking_numbers: [],
          tracking_url: "",
          tracking_urls: [],
          updated_at: "",
          variant_inventory_management: "",
        },
      ])
    );

    const orderId = "5087501320431";
    const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";

    expect(
      async () =>
        await FulfillmentService.isAlreadyFulfilledOnShopify(orderId, userId)
    ).rejects.toThrow(Error);
  });
});
