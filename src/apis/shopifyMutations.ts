export const CANCEL_FULFILLMENT = `mutation cancelFulfillment($fulfillmentId: ID!) {
    fulfillmentCancel(id: $fulfillmentId) {
      fulfillment {
        id
        status
      }
    }
  }
`;

export const CANCEL_ORDER = `
  mutation cancelOrder($orderId: ID!) {
    orderCancel(id: $orderId) {
      order {
        id
        status
      }
    }
  }
`;

export const CREATE_TRANSACTION = `
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

export const INVENTORY_UPDATE = `
  mutation inventoryUpdateAtShopifyForRTO($inventoryUpdateInput: InventoryLevelAdjustInput!) {
    inventoryLevelAdjust(input: $inventoryUpdateInput) {
      inventoryLevel {
        id
        available
      }
    }
  }
`;
