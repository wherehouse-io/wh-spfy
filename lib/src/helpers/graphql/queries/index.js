"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_FULFILLMENT_LIST_COUNT_QUERY = exports.GET_FULFILLMENT_ORDER_QUERY = exports.GET_ACCESS_SCOPE_DATA = exports.GET_INVENTORY_ITEM_DATA = exports.GET_PRODUCT_DATA = exports.getProductsByIdsQuery = exports.GET_LOCATION_DATA = exports.GET_ORDER_DATA = void 0;
exports.GET_ORDER_DATA = `
query getOrderData($externalOrderId: ID!) {
  order(id: $externalOrderId) {
    email
    id
    totalWeight
    taxesIncluded
    discountCodes
    cancelledAt
    displayFinancialStatus
    billingAddress {
      address1
      address2
      city
      country
      firstName
      id
      lastName
      phone
      province
      zip
      company
    }
    shippingAddress {
      address1
      address2
      city
      company
      firstName
      id
      lastName
      phone
      province
      zip
      country
      countryCode
    }
    lineItems (first:10){
      nodes {
        variant {
          id
        }
        name
        product {
          id
        }
        quantity
        taxLines {
          rate
          title
          price
        }
        discountAllocations {
          allocatedAmount {
            amount
          }
        }
        sku
      }
    }
    taxLines {
      price
      rate
      title
    }
    customer {
      email
      phone
      lastName
      id
      firstName
      createdAt
      defaultAddress {
        address1
        address2
        city
        company
        province
        zip
      }
    }
    shippingLines(first:10) {
      nodes {
        taxLines {
          price
        }
        discountedPrice {
          amount
        }
      }
    }
  }
}
`;
exports.GET_LOCATION_DATA = `
  query getLocationData {
    locations(first: 10) {
        nodes {
          id
          name
          address {
          zip
        }
        isActive
        }
    }
  }
`;
function getProductsByIdsQuery(ids) {
    return `query getProductsByIds($limit: Int!) {
    ${ids
        .map((id, index) => `
      product${index}: product(id: "${id}") {
        id
        title
        description
        vendor
        variants(first: $limit) {
          nodes {
            id
            inventoryItem {
              id
            }
          }
        }
      }
    `)
        .join("")}
  }`;
}
exports.getProductsByIdsQuery = getProductsByIdsQuery;
exports.GET_PRODUCT_DATA = `
query getProductData($productId: ID!) {
  product(id: $productId) {
    variants(first:10) {
      nodes {
        barcode
        compareAtPrice
        createdAt
        taxable
        title
        sku
        updatedAt
        inventoryQuantity
        inventoryPolicy
        inventoryItem {
          id
        }
        unitPriceMeasurement {
          quantityUnit
          measuredType
          quantityValue
          referenceUnit
          referenceValue
        }
        price
        position
        product {
          id
        }
      }
    }
  }
}
`;
exports.GET_INVENTORY_ITEM_DATA = `
  query getInventoryItemData($InventoryItemID: ID!) {
    inventoryItem(id: $InventoryItemID) {
      id
      sku
      tracked
      harmonizedSystemCode
    }
  }
`;
exports.GET_ACCESS_SCOPE_DATA = `
query {
      currentAppInstallation {
         accessScopes {
      handle
      description
    }
        }
      }
`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy9ncmFwaHFsL3F1ZXJpZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxjQUFjLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQTZGN0IsQ0FBQztBQUVXLFFBQUEsaUJBQWlCLEdBQUc7Ozs7Ozs7Ozs7Ozs7Q0FhaEMsQ0FBQztBQUVGLFNBQWdCLHFCQUFxQixDQUFDLEdBQUc7SUFDdkMsT0FBTztNQUNILEdBQUc7U0FDRixHQUFHLENBQ0YsQ0FBQyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztlQUNSLEtBQUssa0JBQWtCLEVBQUU7Ozs7Ozs7Ozs7Ozs7O0tBY25DLENBQ0U7U0FDQSxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ1gsQ0FBQztBQUNMLENBQUM7QUF2QkQsc0RBdUJDO0FBRVksUUFBQSxnQkFBZ0IsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBaUMvQixDQUFDO0FBRVcsUUFBQSx1QkFBdUIsR0FBRzs7Ozs7Ozs7O0NBU3RDLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHOzs7Ozs7Ozs7Q0FTcEMsQ0FBQztBQUVXLFFBQUEsMkJBQTJCLEdBQUc7Ozs7Ozs7Ozs7Ozs7O0lBY3ZDLENBQUM7QUFFUSxRQUFBLGdDQUFnQyxHQUFHOzs7Ozs7Ozs7OztJQVc1QyxDQUFDIn0=