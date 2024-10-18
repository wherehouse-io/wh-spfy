"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVENTORY_UPDATE = exports.CREATE_TRANSACTION = exports.CANCEL_ORDER = exports.CANCEL_FULFILLMENT = void 0;
exports.CANCEL_FULFILLMENT = `mutation cancelFulfillment($fulfillmentId: ID!) {
    fulfillmentCancel(id: $fulfillmentId) {
      fulfillment {
        id
        status
      }
    }
  }
`;
exports.CANCEL_ORDER = `
  mutation cancelOrder($orderId: ID!) {
    orderCancel(id: $orderId) {
      order {
        id
        status
      }
    }
  }
`;
exports.CREATE_TRANSACTION = `
  mutation createTransaction($externalOrderId: ID!) {
    orderCreateTransaction(
      input: {
        id: $externalOrderId
        kind: CAPTURE
        source: EXTERNAL
      }
    ) {
      transaction {
        id
        status
      }
    }
  }
`;
exports.INVENTORY_UPDATE = `
  mutation inventoryUpdateAtShopifyForRTO($inventoryUpdateInput: InventoryLevelAdjustInput!) {
    inventoryLevelAdjust(input: $inventoryUpdateInput) {
      inventoryLevel {
        id
        available
      }
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeU11dGF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcGlzL3Nob3BpZnlNdXRhdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxrQkFBa0IsR0FBRzs7Ozs7Ozs7Q0FRakMsQ0FBQztBQUVXLFFBQUEsWUFBWSxHQUFHOzs7Ozs7Ozs7Q0FTM0IsQ0FBQztBQUVXLFFBQUEsa0JBQWtCLEdBQUc7Ozs7Ozs7Ozs7Ozs7OztDQWVqQyxDQUFDO0FBRVcsUUFBQSxnQkFBZ0IsR0FBRzs7Ozs7Ozs7O0NBUy9CLENBQUMifQ==