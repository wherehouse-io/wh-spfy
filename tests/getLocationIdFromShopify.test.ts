import Shopify from "shopify-api-node";
import ShopifyService from "../src/apis/shopify";

jest.setTimeout(1000);

// getLocationIdFromShopify
describe("getLocationIdFromShopify", () => {
  it("Get Location Id From Shopify", async () => {
    const mockAxiosListFulFillment = jest.spyOn(
      ShopifyService,
      "getLocationList"
    );
    mockAxiosListFulFillment.mockReturnValue(
      Promise.resolve([
        {
          id: 123,
          active: true,
          admin_graphql_api_id: "1",
          address1: "Somchintamani Residency",
          address2: null,
          city: "Surat",
          country: "India",
          country_code: "+91",
          country_name: "India",
          created_at: "",
          deleted_at: "",
          legacy: true,
          name: "Somchintamani",
          phone: "",
          province: "",
          province_code: "",
          updated_at: "",
          zip: "395009",
        },
      ])
    );

    const response = await ShopifyService.getLocationIdFromShopify("395009", {
      shopName: "test",
      apiKey: "test",
      password: "test",
    });

    expect(response).toBe(123);
  });
});
