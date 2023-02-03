"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopify_1 = __importDefault(require("../src/apis/shopify"));
jest.setTimeout(1000);
// getLocationIdFromShopify
describe("getLocationIdFromShopify", () => {
    it("Get Location Id From Shopify", async () => {
        const mockAxiosListFulFillment = jest.spyOn(shopify_1.default, "getLocationList");
        mockAxiosListFulFillment.mockReturnValue(Promise.resolve([
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
        ]));
        const response = await shopify_1.default.getLocationIdFromShopify("395009", {
            shopName: "test",
            apiKey: "test",
            password: "test",
        });
        expect(response).toBe(123);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TG9jYXRpb25JZEZyb21TaG9waWZ5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9nZXRMb2NhdGlvbklkRnJvbVNob3BpZnkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtFQUFpRDtBQUVqRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXRCLDJCQUEyQjtBQUMzQixRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLElBQUksRUFBRTtRQUM1QyxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3pDLGlCQUFjLEVBQ2QsaUJBQWlCLENBQ2xCLENBQUM7UUFDRix3QkFBd0IsQ0FBQyxlQUFlLENBQ3RDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDZDtnQkFDRSxFQUFFLEVBQUUsR0FBRztnQkFDUCxNQUFNLEVBQUUsSUFBSTtnQkFDWixvQkFBb0IsRUFBRSxHQUFHO2dCQUN6QixRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxJQUFJLEVBQUUsT0FBTztnQkFDYixPQUFPLEVBQUUsT0FBTztnQkFDaEIsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLFlBQVksRUFBRSxPQUFPO2dCQUNyQixVQUFVLEVBQUUsRUFBRTtnQkFDZCxVQUFVLEVBQUUsRUFBRTtnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixJQUFJLEVBQUUsZUFBZTtnQkFDckIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osYUFBYSxFQUFFLEVBQUU7Z0JBQ2pCLFVBQVUsRUFBRSxFQUFFO2dCQUNkLEdBQUcsRUFBRSxRQUFRO2FBQ2Q7U0FDRixDQUFDLENBQ0gsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUU7WUFDdkUsUUFBUSxFQUFFLE1BQU07WUFDaEIsTUFBTSxFQUFFLE1BQU07WUFDZCxRQUFRLEVBQUUsTUFBTTtTQUNqQixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==