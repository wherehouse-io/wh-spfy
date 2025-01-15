export declare const CANCEL_FULFILLMENT = "mutation cancelFulfillment($fulfillmentId: ID!) {\n    fulfillmentCancel(id: $fulfillmentId) {\n      fulfillment {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n";
export declare const CANCEL_ORDER = "\nmutation cancelOrder($orderId: ID!,$reason: OrderCancelReason!, $refund: Boolean!, $restock: Boolean!) {\n    orderCancel(orderId: $orderId,reason: $reason, refund: $refund, restock: $restock) {\n       job{\n        done,\n        id\n       }\n       orderCancelUserErrors{\n        code\n        field\n        message\n       }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n    \n";
export declare const CREATE_TRANSACTION = "\n  mutation createTransaction($externalOrderId: ID!, $amount: Money!, $parentTransactionId: ID!) {\n   orderCapture(\n      input: {\n        id: $externalOrderId\n        amount: $amount\n        kind: SALE\n        parentTransactionId : $parentTransactionId\n      }\n    ) {\n      transaction {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n";
export declare const INVENTORY_UPDATE = "\n  mutation inventoryUpdateAtShopifyForRTO($available_adjustment: Int!, $location_id:ID!,$name:String!, $reason: String!,$inventory_item_id:ID!) {\n    inventoryAdjustQuantities(input:  {\n     reason: $reason,\n     name: $name, \n     changes:{\n     delta: $available_adjustment, \n     inventoryItemId: $inventory_item_id, \n     locationId: $location_id\n     }\n    }) {\n        inventoryAdjustmentGroup {\n      createdAt\n      reason\n      referenceDocumentUri\n      changes {\n        name\n        delta\n      }\n    }  \n      userErrors {\n        field\n        message\n      }\n    }\n  }\n";
export declare const MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = "mutation movefulfillmentOrderlocation($id: ID! , $wherehouseAssignedLocationId: ID!){\n    fulfillmentOrderMove(id: $id, newLocationId: $wherehouseAssignedLocationId) {\n        movedFulfillmentOrder {\n        id\n        status\n      }\n      originalFulfillmentOrder {\n        id\n        status\n      }\n      remainingFulfillmentOrder {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n      }\n  ";
export declare const CREATE_FULFILLMENT_MUTATION = "mutation createFulfillment($trackingNumber: String!, $trackingUrl: URL!, $trackingCompany: String!, $notifyCustomer: Boolean!, $fulfillmentOrderId: ID!) {\n    fulfillmentCreate(fulfillment: {\n      trackingInfo: {\n        number: $trackingNumber,\n        url: $trackingUrl,\n        company: $trackingCompany\n      },\n      notifyCustomer: $notifyCustomer,\n      lineItemsByFulfillmentOrder: [\n        {\n          fulfillmentOrderId: $fulfillmentOrderId\n        }\n      ]\n    }) {\n      fulfillment {\n      createdAt\n      displayStatus\n      id\n      name\n      location {\n        isActive\n        id\n        createdAt\n        address {\n          address1\n          address2\n          city\n          country\n          phone\n          zip\n          latitude\n          longitude\n        }\n        name\n      }\n      status\n      totalQuantity\n      trackingInfo {\n        company\n        number\n        url\n      }\n      updatedAt\n      requiresShipping\n    }\n      userErrors {\n        field\n        message\n      }\n    }\n  }";
export declare const FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = "mutation createFulfillment(\n    $trackingNumber: String!, \n    $trackingUrls: [URL!]!, \n    $trackingCompany: String!, \n    $notifyCustomer: Boolean!, \n    $fulfillmentOrderId: ID!\n  ) {\n  \n    fulfillmentCreate(fulfillment: {\n      lineItemsByFulfillmentOrder: [\n        {\n          fulfillmentOrderId: $fulfillmentOrderId\n        }\n      ]\n      trackingInfo: {\n        number: $trackingNumber,\n        urls: $trackingUrls,\n        company: $trackingCompany\n      },\n      notifyCustomer: $notifyCustomer\n    }) {\n      fulfillment {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }";
export declare const WEBHOOK_MUTATION = "mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $address: URL!) {\n    webhookSubscriptionCreate(topic: $topic, webhookSubscription: {callbackUrl: $address, format: JSON}) {\n      webhookSubscription {\n        id\n        topic\n        apiVersion {\n          handle\n        }\n        format\n        createdAt\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n";
