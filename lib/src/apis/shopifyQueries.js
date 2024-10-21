"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_ACCESS_SCOPE_DATA = exports.GET_INVENTORY_ITEM_DATA = exports.GET_PRODUCT_DATA = exports.getProductsByIdsQuery = exports.GET_LOCATION_DATA = exports.GET_ORDER_DATA = void 0;
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
query getProductData($productID: ID!) {
  product(id: $productID) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeVF1ZXJpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9zaG9waWZ5UXVlcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGNBQWMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBNkY3QixDQUFDO0FBRVcsUUFBQSxpQkFBaUIsR0FBRzs7Ozs7Ozs7Ozs7OztDQWFoQyxDQUFDO0FBRUYsU0FBZ0IscUJBQXFCLENBQUMsR0FBRztJQUN2QyxPQUFPO01BQ0gsR0FBRztTQUNGLEdBQUcsQ0FDRixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO2VBQ1IsS0FBSyxrQkFBa0IsRUFBRTs7Ozs7Ozs7Ozs7Ozs7S0FjbkMsQ0FDRTtTQUNBLElBQUksQ0FBQyxFQUFFLENBQUM7SUFDWCxDQUFDO0FBQ0wsQ0FBQztBQXZCRCxzREF1QkM7QUFFWSxRQUFBLGdCQUFnQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQy9CLENBQUM7QUFFVyxRQUFBLHVCQUF1QixHQUFHOzs7Ozs7Ozs7Q0FTdEMsQ0FBQztBQUVXLFFBQUEscUJBQXFCLEdBQUc7Ozs7Ozs7OztDQVNwQyxDQUFDIn0=