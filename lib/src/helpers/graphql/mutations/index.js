"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOK_MUTATION = exports.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = exports.CREATE_FULFILLMENT_MUTATION = exports.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = exports.INVENTORY_UPDATE = exports.CREATE_TRANSACTION = exports.CANCEL_ORDER = exports.CANCEL_FULFILLMENT = void 0;
exports.CANCEL_FULFILLMENT = `mutation cancelFulfillment($fulfillmentId: ID!) {
    fulfillmentCancel(id: $fulfillmentId) {
      fulfillment {
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
exports.CANCEL_ORDER = `
mutation cancelOrder($orderId: ID!,$reason: OrderCancelReason!, $refund: Boolean!, $restock: Boolean!) {
    orderCancel(orderId: $orderId,reason: $reason, refund: $refund, restock: $restock) {
       job{
        done,
        id
       }
       orderCancelUserErrors{
        code
        field
        message
       }
      userErrors {
        field
        message
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
  mutation inventoryUpdateAtShopifyForRTO($available_adjustment: Int!, $location_id:ID!,$name:String!, $reason: String!,$inventory_item_id:ID!) {
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
      userErrors {
        field
        message
      }
    }
  }
`;
exports.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = `mutation movefulfillmentOrderlocation($id: ID! , $wherehouseAssignedLocationId: ID!){
    fulfillmentOrderMove(id: $id, newLocationId: $wherehouseAssignedLocationId) {
        movedFulfillmentOrder {
        id
        status
      }
      originalFulfillmentOrder {
        id
        status
      }
      remainingFulfillmentOrder {
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
      createdAt
      displayStatus
      id
      name
      location {
        isActive
        id
        createdAt
        address {
          address1
          address2
          city
          country
          phone
          zip
          latitude
          longitude
        }
        name
      }
      status
      totalQuantity
      trackingInfo {
        company
        number
        url
      }
      updatedAt
      requiresShipping
    }
      userErrors {
        field
        message
      }
    }
  }`;
exports.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = `mutation createFulfillment(
    $trackingNumber: String!, 
    $trackingUrls: [URL!]!, 
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
exports.WEBHOOK_MUTATION = `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $address: URL!) {
    webhookSubscriptionCreate(topic: $topic, webhookSubscription: {callbackUrl: $address, format: JSON}) {
      webhookSubscription {
        id
        topic
        apiVersion {
          handle
        }
        format
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy9ncmFwaHFsL211dGF0aW9ucy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGtCQUFrQixHQUFHOzs7Ozs7Ozs7Ozs7Q0FZakMsQ0FBQztBQUVXLFFBQUEsWUFBWSxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBbUIzQixDQUFDO0FBRVcsUUFBQSxrQkFBa0IsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQmpDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FxQi9CLENBQUM7QUFFVyxRQUFBLHdDQUF3QyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9CckQsQ0FBQztBQUVTLFFBQUEsMkJBQTJCLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0R2QyxDQUFDO0FBRVEsUUFBQSxnREFBZ0QsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBOEI1RCxDQUFDO0FBRVEsUUFBQSxnQkFBZ0IsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQi9CLENBQUMifQ==