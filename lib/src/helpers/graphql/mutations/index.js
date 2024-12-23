"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = exports.CREATE_FULFILLMENT_MUTATION = exports.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = exports.INVENTORY_UPDATE = exports.CREATE_TRANSACTION = exports.CANCEL_ORDER = exports.CANCEL_FULFILLMENT = void 0;
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
  mutation createTransaction($externalOrderId: ID!, $amount: Money!, $parentTransactionId: ID!) {
   orderCapture(
      input: {
        id: $externalOrderId
        amount: $amount
        kind: SALE
        parentTransactionId : $parentTransactionId
      }
    ) {
      transaction {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;
exports.INVENTORY_UPDATE = `
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
exports.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = `mutation movefulfillmentOrderlocation($id: ID! , $wherehouseAssignedLocationId: ID!){
    fulfillmentOrderMove(id: $id, newLocationId: $wherehouseAssignedLocationId) {
      movedFulfillmentOrder {
        id
        assignedLocation {
          id
        }
      }
      userErrors {
        field
        message
      }
    }
      }
  `;
exports.CREATE_FULFILLMENT_MUTATION = `mutation createFulfillment($trackingNumber: String!, $trackingUrl: URL!, $trackingCompany: String!, $notifyCustomer: Boolean!, $fulfillmentOrderId: ID!) {
    fulfillmentCreate(fulfillment: {
      trackingInfo: {
        number: $trackingNumber,
        url: $trackingUrl,
        company: $trackingCompany
      },
      notifyCustomer: $notifyCustomer,
      lineItemsByFulfillmentOrder: [
        {
          fulfillmentOrderId: $fulfillmentOrderId
        }
      ]
    }) {
      fulfillment {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`;
exports.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = `mutation createFulfillment(
    $trackingNumber: String!, 
    $trackingUrls: [String!]!, 
    $trackingCompany: String!, 
    $notifyCustomer: Boolean!, 
    $fulfillmentOrderId: ID!
  ) {
  
    fulfillmentCreate(fulfillment: {
      lineItemsByFulfillmentOrder: [
        {
          fulfillmentOrderId: $fulfillmentOrderId
        }
      ]
      trackingInfo: {
        number: $trackingNumber,
        urls: $trackingUrls,
        company: $trackingCompany
      },
      notifyCustomer: $notifyCustomer
    }) {
      fulfillment {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy9ncmFwaHFsL211dGF0aW9ucy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGtCQUFrQixHQUFHOzs7Ozs7OztDQVFqQyxDQUFDO0FBRVcsUUFBQSxZQUFZLEdBQUc7Ozs7Ozs7OztDQVMzQixDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQmpDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7OztDQWlCL0IsQ0FBQztBQUdXLFFBQUEsd0NBQXdDLEdBQUc7Ozs7Ozs7Ozs7Ozs7O0dBY3JELENBQUM7QUFFVyxRQUFBLDJCQUEyQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXVCekMsQ0FBQztBQUVVLFFBQUEsZ0RBQWdELEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQThCOUQsQ0FBQyJ9