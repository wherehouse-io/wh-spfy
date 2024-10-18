"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_ACCESS_SCOPE_DATA = exports.GET_INVENTORY_ITEM_DATA = exports.GET_PRODUCT_DATA = exports.GET_ALL_PRODUCTS = exports.GET_LOCATION_DATA = exports.GET_ORDER_DATA = void 0;
exports.GET_ORDER_DATA = `
  query getOrderData($externalOrderId: ID!) {
    order(id: $externalOrderId) {
      id
      name
      email
      paymentGatewayNames
      totalPrice
      lineItems(first: 5) {
        
          nodes {
            title
            quantity
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
        }
    }
  }
`;
exports.GET_ALL_PRODUCTS = `
  query getAllProductList($limit: Int!) {
    products(first: $limit) {
    nodes {
      id
      title
      vendor
      variants (first: $limit){
        nodes {
          id
          inventoryItem {
            id
          }
        }
      }
    }
  }
  }
`;
exports.GET_PRODUCT_DATA = `
  query getProductData($productID: ID!) {
    product(id: $productID) {
  id
  title
  description
  vendor
  variants(first: 10) {
    nodes {
        inventoryItem {
          id
        }
        id
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvcGlmeVF1ZXJpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBpcy9zaG9waWZ5UXVlcmllcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGNBQWMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBa0I3QixDQUFDO0FBRVcsUUFBQSxpQkFBaUIsR0FBRzs7Ozs7Ozs7O0NBU2hDLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FrQi9CLENBQUM7QUFFVyxRQUFBLGdCQUFnQixHQUFHOzs7Ozs7Ozs7Ozs7Ozs7OztDQWlCL0IsQ0FBQztBQUVXLFFBQUEsdUJBQXVCLEdBQUc7Ozs7Ozs7OztDQVN0QyxDQUFDO0FBRVcsUUFBQSxxQkFBcUIsR0FBRzs7Ozs7Ozs7O0NBU3BDLENBQUMifQ==