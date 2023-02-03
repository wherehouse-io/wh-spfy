"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fulfillment_1 = __importDefault(require("../src/apis/fulfillment"));
const shopify_1 = __importDefault(require("../src/apis/shopify"));
jest.setTimeout(1000);
// isAlreadyFulfilledOnShopify
describe("isAlreadyFulfilledOnShopify", () => {
    it("Fulfillment is not there", async () => {
        const mockAxios = jest.spyOn(shopify_1.default, "getShopifyUrlInstance");
        mockAxios.mockReturnValue(Promise.resolve({
            shopName: "test",
            apiKey: "test",
            password: "test",
        }));
        const mockAxiosListFulFillment = jest.spyOn(fulfillment_1.default, "getFulFillmentListDetails");
        mockAxiosListFulFillment.mockReturnValue(Promise.resolve([]));
        const orderId = "5087501320431";
        const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
        const response = await fulfillment_1.default.isAlreadyFulfilledOnShopify(orderId, userId);
        expect(response.fulfilled).toBe(false);
    });
    it("Fulfillment is there but fulfilled by wherehouse", async () => {
        const mockAxios = jest.spyOn(shopify_1.default, "getShopifyUrlInstance");
        mockAxios.mockReturnValue(Promise.resolve({
            shopName: "test",
            apiKey: "test",
            password: "test",
        }));
        const mockAxiosListFulFillment = jest.spyOn(fulfillment_1.default, "getFulFillmentListDetails");
        mockAxiosListFulFillment.mockReturnValue(Promise.resolve([
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
        ]));
        const orderId = "5087501320431";
        const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
        const response = await fulfillment_1.default.isAlreadyFulfilledOnShopify(orderId, userId);
        expect(response.fulfilled).toBe(true);
        expect(response.fulfilledBy).toBe("Wherehouse");
    });
    it("Fulfillment is there but not fulfilled by wherehouse", async () => {
        const mockAxios = jest.spyOn(shopify_1.default, "getShopifyUrlInstance");
        mockAxios.mockReturnValue(Promise.resolve({
            shopName: "test",
            apiKey: "test",
            password: "test",
        }));
        const mockAxiosListFulFillment = jest.spyOn(fulfillment_1.default, "getFulFillmentListDetails");
        mockAxiosListFulFillment.mockReturnValue(Promise.resolve([
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
        ]));
        const orderId = "5087501320431";
        const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
        expect(async () => await fulfillment_1.default.isAlreadyFulfilledOnShopify(orderId, userId)).rejects.toThrow(Error);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL2Z1bGZpbGxtZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSwwRUFBeUQ7QUFDekQsa0VBQWlEO0FBRWpELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEIsOEJBQThCO0FBQzlCLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7SUFDM0MsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3RFLFNBQVMsQ0FBQyxlQUFlLENBQ3ZCLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDZCxRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FDSCxDQUFDO1FBRUYsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUN6QyxxQkFBa0IsRUFDbEIsMkJBQTJCLENBQzVCLENBQUM7UUFDRix3QkFBd0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTlELE1BQU0sT0FBTyxHQUFHLGVBQWUsQ0FBQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxzQ0FBc0MsQ0FBQztRQUN0RCxNQUFNLFFBQVEsR0FBRyxNQUFNLHFCQUFrQixDQUFDLDJCQUEyQixDQUNuRSxPQUFPLEVBQ1AsTUFBTSxDQUNQLENBQUM7UUFFRixNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxLQUFLLElBQUksRUFBRTtR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