"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopify_api_node_1 = __importDefault(require("shopify-api-node"));
const shopify_1 = __importDefault(require("../src/apis/shopify"));
jest.setTimeout(1000);
// cancelOrder
describe("cancelOrder", () => {
    it("Cancel Order", async () => {
        const mockAxios = jest.spyOn(shopify_1.default, "getShopifyInstance");
        mockAxios.mockReturnValue(Promise.resolve(new shopify_api_node_1.default({
            shopName: "test",
            apiKey: "test",
            password: "test",
        })));
        const mockCancelOrder = jest.spyOn(shopify_1.default, "cancelOrder");
        mockCancelOrder.mockResolvedValue(true);
        const orderId = "4b5ab279-66fb-45ad-98e5-63b330f44492";
        const responseCancelOrder = await shopify_1.default.cancelOrder({
            shopName: "test",
            apiKey: "test",
            password: "test",
        }, orderId);
        expect(responseCancelOrder).toStrictEqual({});
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuY2VsT3JkZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3RzL2NhbmNlbE9yZGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3RUFBbUQ7QUFDbkQsa0VBQWlEO0FBRWpELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEIsY0FBYztBQUNkLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLEVBQUUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDNUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBYyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDbkUsU0FBUyxDQUFDLGVBQWUsQ0FDdkIsT0FBTyxDQUFDLE9BQU8sQ0FDYixJQUFJLDBCQUFPLENBQUM7WUFDVixRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FDSCxDQUNGLENBQUM7UUFFRixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFjLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDbEUsZUFBZSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhDLE1BQU0sT0FBTyxHQUFHLHNDQUFzQyxDQUFDO1FBQ3ZELE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxpQkFBYyxDQUFDLFdBQVcsQ0FDMUQ7WUFDRSxRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLEVBQ0QsT0FBTyxDQUNSLENBQUM7UUFFRixNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9