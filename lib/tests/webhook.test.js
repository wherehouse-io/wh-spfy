"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webhook_1 = __importDefault(require("../src/apis/webhook"));
jest.setTimeout(1000);
// registerWebhooks
describe("registerWebhooks", () => {
    it("Registering webhooks", async () => {
        const mockAxiosListFulFillment = jest.spyOn(webhook_1.default, "callRegisterWebhook");
        const dataResponse = {
            data: {
                webhook: {
                    id: "1",
                },
            },
            status: 200,
            statusText: "Success",
            headers: "",
            config: {},
        };
        mockAxiosListFulFillment.mockReturnValue(Promise.resolve(dataResponse));
        const mockGetShopify = jest.spyOn(webhook_1.default, "getShopifyWebhooks");
        mockGetShopify.mockReturnValue([
            {
                topic: "topic",
                address: "address",
            },
        ]);
        const response = await webhook_1.default.registerWebhooks({
            key: "key",
            secret: "secret",
            shop: "shop",
        });
        expect(response.message).toBe("Successfully created all Shopify Hooks");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViaG9vay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdHMvd2ViaG9vay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0VBQWlEO0FBRWpELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEIsbUJBQW1CO0FBQ25CLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ3BDLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDekMsaUJBQWMsRUFDZCxxQkFBcUIsQ0FDdEIsQ0FBQztRQUNGLE1BQU0sWUFBWSxHQUFrQjtZQUNsQyxJQUFJLEVBQUU7Z0JBQ0osT0FBTyxFQUFFO29CQUNQLEVBQUUsRUFBRSxHQUFHO2lCQUNSO2FBQ0Y7WUFDRCxNQUFNLEVBQUUsR0FBRztZQUNYLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLE9BQU8sRUFBRSxFQUFFO1lBQ1gsTUFBTSxFQUFFLEVBQUU7U0FDWCxDQUFDO1FBQ0Ysd0JBQXdCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUV4RSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFjLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUN4RSxjQUFjLENBQUMsZUFBZSxDQUFDO1lBQzdCO2dCQUNFLEtBQUssRUFBRSxPQUFPO2dCQUNkLE9BQU8sRUFBRSxTQUFTO2FBQ25CO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxpQkFBYyxDQUFDLGdCQUFnQixDQUFDO1lBQ3JELEdBQUcsRUFBRSxLQUFLO1lBQ1YsTUFBTSxFQUFFLFFBQVE7WUFDaEIsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQzFFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==