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


// need to figure out the parentTransactionId 
export const CREATE_TRANSACTION = `
  mutation createTransaction($externalOrderId: ID!, $parentId: ID!,$amount: Money!) {
   orderCapture(
      input: {
        id: $externalOrderId
        parentTransactionId:$parentId
        amount: $amount
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
  mutation inventoryUpdateAtShopifyForRTO($available_adjustment: Int!, $location_id:number!,$name:String!, $reason: String!,$inventory_item_id:ID!) {
    inventoryAdjustQuantities(input:  {
     reason: $reason,
     name: $name, 
     changes:{
     delta: $available_adjustment, 
     inventoryItemId: $inventory_item_id, 
     locationId: $location_id
     }
    }) {
      inventoryLevel {
        id
        available
      }
    }
  }
`;
