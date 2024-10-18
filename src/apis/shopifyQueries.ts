export const GET_ORDER_DATA = `
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

export const GET_LOCATION_DATA = `
  query getLocationData {
    locations(first: 10) {
        nodes {
          id
          name
        }
    }
  }
`;

export const GET_ALL_PRODUCTS = `
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

export const GET_PRODUCT_DATA = `
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

export const GET_INVENTORY_ITEM_DATA = `
  query getInventoryItemData($InventoryItemID: ID!) {
    inventoryItem(id: $InventoryItemID) {
      id
      sku
      tracked
      harmonizedSystemCode
    }
  }
`;

export const GET_ACCESS_SCOPE_DATA = `
query {
      currentAppInstallation {
         accessScopes {
      handle
      description
    }
        }
      }
`;
