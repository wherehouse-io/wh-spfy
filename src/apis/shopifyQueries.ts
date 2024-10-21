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
          address {
          zip
        }
        isActive
        }
    }
  }
`;

export function getProductsByIdsQuery(ids) {
  return `query getProductsByIds($limit: Int!) {
    ${ids
      .map(
        (id, index) => `
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
    `
      )
      .join("")}
  }`;
}

export const GET_PRODUCT_DATA = `
  query getProductData($productID: ID!,$feilds:String!) {
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
