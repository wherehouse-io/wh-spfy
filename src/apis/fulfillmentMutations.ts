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


export const FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = `mutation createFulfillment(
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
