"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_FULFILLMENT_LIST_COUNT_QUERY = exports.GET_FULFILLMENT_ORDER_QUERY = void 0;
exports.GET_FULFILLMENT_ORDER_QUERY = `query getOrderData($getFulfillmentOrderId: ID!) {
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
exports.GET_FULFILLMENT_LIST_COUNT_QUERY = `
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVsZmlsbG1lbnRRdWVyaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwaXMvZnVsZmlsbG1lbnRRdWVyaWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsMkJBQTJCLEdBQUc7Ozs7Ozs7Ozs7Ozs7O0NBYzFDLENBQUM7QUFFVyxRQUFBLGdDQUFnQyxHQUFHOzs7Ozs7Ozs7OztDQVcvQyxDQUFDIn0=