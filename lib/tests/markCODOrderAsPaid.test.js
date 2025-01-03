"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shopify_api_node_1 = __importDefault(require("shopify-api-node"));
const shopify_1 = __importDefault(require("../src/apis/shopify"));
jest.setTimeout(1000);
// cancelOrderFulfillment
describe("cancelOrderFulfillment", () => {
    it("Cancel Order Fulfillment", async () => {
        const mockAxios = jest.spyOn(shopify_1.default, "getShopifyInstance");
        mockAxios.mockReturnValue(Promise.resolve(new shopify_api_node_1.default({
            shopName: "test",
            apiKey: "test",
            password: "test",
        })));
        const mockCreateTransaction = jest.spyOn(shopify_1.default, "createTransactionAtShopify");
        mockCreateTransaction.mockResolvedValue({});
        const orderId = "4b5ab279-66fb-45ad-98e5-63b330f44492";
        const userId = "1f6791ec-d4fe-4f5c-a7d8-052deff696be";
        const responseCancelFulfillment = await shopify_1.default.markCODOrderAsPaid(orderId, userId);
        expect(responseCancelFulfillment).toStrictEqual({});
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya0NPRE9yZGVyQXNQYWlkLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9tYXJrQ09ET3JkZXJBc1BhaWQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdFQUF5RDtBQUN6RCxrRUFBaUQ7QUFFakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV0Qix5QkFBeUI7QUFDekIsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxFQUFFLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxJQUFJLEVBQUU7UUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBYyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDbkUsU0FBUyxDQUFDLGVBQWUsQ0FDdkIsT0FBTyxDQUFDLE9BQU8sQ0FDYixJQUFJLDBCQUFPLENBQUM7WUFDVixRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsTUFBTTtZQUNkLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUMsQ0FDSCxDQUNGLENBQUM7UUFFRixNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQ3RDLGlCQUFjLEVBQ2QsNEJBQTRCLENBQzdCLENBQUM7UUFDRixxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFrQixDQUFDLENBQUM7UUFFNUQsTUFBTSxPQUFPLEdBQUcsc0NBQXNDLENBQUM7UUFDdkQsTUFBTSxNQUFNLEdBQUcsc0NBQXNDLENBQUM7UUFDdEQsTUFBTSx5QkFBeUIsR0FBRyxNQUFNLGlCQUFjLENBQUMsa0JBQWtCLENBQ3ZFLE9BQU8sRUFDUCxNQUFNLENBQ1AsQ0FBQztRQUVGLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=