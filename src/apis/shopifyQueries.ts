export const GET_ORDER_DATA = `
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
