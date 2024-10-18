export const GET_FULFILLMENT_ORDER_QUERY = `query getOrderData($getFulfillmentOrderId: ID!) {
 order(id: $getFulfillmentOrderId) {
    fulfillmentOrders(first:10) {
        nodes {
          id
          assignedLocation {
          location {
            id
          }
        }
        }
      }
  }
 }
`;

export const GET_FULFILLMENT_LIST_COUNT_QUERY = `
  query getFulfillmentListCount($fulfillmentId: ID!) {
   order(id: $fulfillmentId) {
  fulfillments {
    status
    trackingInfo {
      company
    }
  }
}
  }
`;
