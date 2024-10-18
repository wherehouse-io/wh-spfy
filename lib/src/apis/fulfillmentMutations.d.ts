export declare const MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = "mutation movefulfillmentOrderlocation($id: ID! , $wherehouseAssignedLocationId: ID!){\n  fulfillmentOrderMove(id: $id, newLocationId: $wherehouseAssignedLocationId) {\n    movedFulfillmentOrder {\n      id\n      assignedLocation {\n        id\n      }\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n    }\n";
export declare const CREATE_FULFILLMENT_MUTATION = "mutation createFulfillment($locationId: ID!, $trackingNumber: String!, $trackingUrl: URL!, $trackingCompany: String!, $notifyCustomer: Boolean!, $fulfillmentOrderId: ID!) {\n  fulfillmentCreate(fulfillment: {\n    locationId: $locationId,\n    trackingInfo: {\n      number: $trackingNumber,\n      url: $trackingUrl,\n      company: $trackingCompany\n    },\n    notifyCustomer: $notifyCustomer,\n    lineItemsByFulfillmentOrder: [\n      {\n        fulfillmentOrderId: $fulfillmentOrderId\n      }\n    ]\n  }) {\n    fulfillment {\n      id\n      status\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}";
export declare const FULFILLMENT_MUTATION = "mutation createFulfillment(\n    $locationId: ID!, \n    $trackingNumber: String!, \n    $trackingUrl: String!, \n    $trackingCompany: String!, \n    $notifyCustomer: Boolean!, \n    $fulfillmentOrderId: ID!\n  ) {\n    fulfillmentCreate(fulfillment: {\n      locationId: $locationId,\n      trackingInfo: {\n        number: $trackingNumber,\n        url: $trackingUrl,\n        company: $trackingCompany\n      },\n      notifyCustomer: $notifyCustomer,\n      lineItemsByFulfillmentOrder: [\n        {\n          fulfillmentOrderId: $fulfillmentOrderId\n        }\n      ]\n    }) {\n      fulfillment {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }";
