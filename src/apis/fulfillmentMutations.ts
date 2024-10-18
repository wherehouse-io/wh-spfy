export const MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = `mutation movefulfillmentOrderlocation($id: ID! , $wherehouseAssignedLocationId: ID!){
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

export const CREATE_FULFILLMENT_MUTATION = `mutation createFulfillment($locationId: ID!, $trackingNumber: String!, $trackingUrl: URL!, $trackingCompany: String!, $notifyCustomer: Boolean!, $fulfillmentOrderId: ID!) {
  fulfillmentCreate(fulfillment: {
    locationId: $locationId,
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

export const FULFILLMENT_MUTATION = `mutation createFulfillment(
    $locationId: ID!, 
    $trackingNumber: String!, 
    $trackingUrl: String!, 
    $trackingCompany: String!, 
    $notifyCustomer: Boolean!, 
    $fulfillmentOrderId: ID!
  ) {
    fulfillmentCreate(fulfillment: {
      locationId: $locationId,
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
