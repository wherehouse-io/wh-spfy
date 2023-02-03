"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopify_1 = __importDefault(require("../src/apis/shopify"));
jest.setTimeout(1000);
// cancelOrderFulfillment
describe("cancelOrderFulfillment", () => {
    it("Cancel Order Fulfillment", async () => {
        const mockAxiosUrl = jest.spyOn(shopify_1.default, "getShopifyUrlInstance");
        mockAxiosUrl.mockReturnValue(Promise.resolve({
            shopName: "test",
            apiKey: "test",
            password: "test",
        }));
        const mockGetWherehouseFulfillment = jest.spyOn(shopify_1.default, "getWherehouseFulfillment");
        mockGetWherehouseFulfillment.mockResolvedValue({});
        const mockCancelFulfillment = jest.spyOn(shopify_1.default, "cancelFulfillment");
        mockCancelFulfillment.mockResolvedValue({});
        const orderId = "4b5ab279-66fb-45ad-98e5-63b330f44492";
        const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
        const responseCancelFulfillment = await shopify_1.default.cancelOrderFulfillment(orderId, userId);
        expect(responseCancelFulfillment).toStrictEqual({});
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuY2VsT3JkZXJGdWxmaWxsbWVudC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvY2FuY2VsT3JkZXJGdWxmaWxsbWVudC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0VBQWlEO0FBRWpELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEIseUJBQXlCO0FBQ3pCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7SUFDdEMsRUFBRSxDQUFDLDBCQUEwQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3hDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3pFLFlBQVksQ0FBQyxlQUFlLENBQzFCLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDZCxRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FDSCxDQUFDO1FBRUYsTUFBTSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM3QyxpQkFBYyxFQUNkLDBCQUEwQixDQUMzQixDQUFDO1FBQ0YsNEJBQTRCLENBQUMsaUJBQWlCLENBQUMsRUFBdUIsQ0FBQyxDQUFDO1FBRXhFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDdEMsaUJBQWMsRUFDZCxtQkFBbUIsQ0FDcEIsQ0FBQztRQUNGLHFCQUFxQixDQUFDLGlCQUFpQixDQUFDLEVBQWtCLENBQUMsQ0FBQztRQUU1RCxNQUFNLE9BQU8sR0FBRyxzQ0FBc0MsQ0FBQztRQUN2RCxNQUFNLE1BQU0sR0FBRyxzQ0FBc0MsQ0FBQztRQUN0RCxNQUFNLHlCQUF5QixHQUM3QixNQUFNLGlCQUFjLENBQUMsc0JBQXNCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=