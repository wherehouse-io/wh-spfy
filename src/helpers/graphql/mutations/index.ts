export const CANCEL_FULFILLMENT = `mutation cancelFulfillment($fulfillmentId: ID!) {
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

export const CANCEL_ORDER = `
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

export const CREATE_TRANSACTION = `
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

export const INVENTORY_UPDATE = `
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

export const MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = `mutation movefulfillmentOrderlocation($id: ID! , $wherehouseAssignedLocationId: ID!){
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

export const CREATE_FULFILLMENT_MUTATION = `mutation createFulfillment($trackingNumber: String!, $trackingUrl: URL!, $trackingCompany: String!, $notifyCustomer: Boolean!, $fulfillmentOrderId: ID!) {
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

export const FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = `mutation createFulfillment(
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

export const WEBHOOK_MUTATION = `mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $address: URL!) {
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
