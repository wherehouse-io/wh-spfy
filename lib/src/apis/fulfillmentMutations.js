"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FULFILLMENT_MUTATION_WITH_MULTIPLE_TRACKING_URLS = exports.CREATE_FULFILLMENT_MUTATION = exports.MOVE_ORDER_FULFILLMENT_LOCATION_MUTATION = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnRNdXRhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9mdWxmaWxsbWVudE11dGF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLHdDQUF3QyxHQUFHOzs7Ozs7Ozs7Ozs7OztDQWN2RCxDQUFDO0FBRVcsUUFBQSwyQkFBMkIsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF1QnpDLENBQUM7QUFFVSxRQUFBLGdEQUFnRCxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE4QjlELENBQUMifQ==