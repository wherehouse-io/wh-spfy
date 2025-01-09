export const GET_ORDER_DATA = `
query getOrderData($getOrderId: ID!) {
  order(id: $getOrderId) {
          name
                taxesIncluded
                fullyPaid
                discountCodes
                displayFinancialStatus
                createdAt
                updatedAt
                billingAddress {
                    address1
                    address2
                    city
                    company
                    country
                    countryCode
                    firstName
                    lastName
                    id
                    name
                    phone
                    province
                    provinceCode
                    timeZone
                    zip
                    longitude
                    latitude
                    formattedArea
                    countryCodeV2
                    coordinatesValidated
                }
                shippingAddress {
                    address1
                    address2
                    city
                    company
                    country
                    coordinatesValidated
                    countryCode
                    countryCodeV2
                    firstName
                    formattedArea
                    id
                    lastName
                    latitude
                    longitude
                    name
                    phone
                    province
                    provinceCode
                    timeZone
                    zip
                }
                lineItems(first: 20) {
                    edges {
                        node {
                            originalUnitPrice
                            originalTotal
                            originalTotalSet {
                                presentmentMoney {
                                    amount
                                }
                                shopMoney {
                                    amount
                                }
                            }
                            discountAllocations {
                                allocatedAmount {
                                    amount
                                }
                            }
                            currentQuantity
                            discountedTotal
                            discountedUnitPrice
                            fulfillableQuantity
                            fulfillmentStatus
                            id
                            name
                            nonFulfillableQuantity
                            originalTotal
                            originalUnitPrice
                            quantity
                            requiresShipping
                            refundableQuantity
                            restockable
                            sku
                            variantTitle
                            vendor
                            variant {
                                id
                            }
                            product {
                                id
                            }
                            taxLines {
                                rate
                            }
                        }
                    }
                }
                taxLines {
                    channelLiable
                    price
                    priceSet {
                        shopMoney {
                            amount
                            currencyCode
                        }
                    }
                    rate
                    ratePercentage
                    title
                }
                totalWeight
                customer {
                    createdAt
                    email
                    displayName
                    firstName
                    hasTimelineComment
                    id
                    lastName
                    tags
                    taxExempt
                    taxExemptions
                    unsubscribeUrl
                    updatedAt
                    validEmailAddress
                    verifiedEmail
                    note
                    multipassIdentifier
                    numberOfOrders
                    phone
                    productSubscriberStatus
                    legacyResourceId
                    lifetimeDuration
                    locale
                    amountSpent {
                        amount
                        currencyCode
                    }
                    addresses {
                        address1
                        address2
                        city
                        coordinatesValidated
                        company
                        country
                        countryCode
                        countryCodeV2
                        firstName
                        formattedArea
                        id
                        lastName
                        latitude
                        longitude
                        name
                        phone
                        provinceCode
                        province
                        timeZone
                        zip
                    }
                }
                shippingLines(first: 20) {
                    edges {
                        node {
                            taxLines {
                                price
                            }
                            discountedPrice {
                                amount
                            }
                        }
                    }
                }
                currentTotalPriceSet {
                    shopMoney {
                        amount
                        currencyCode
                    }
                }
                paymentGatewayNames
                tags
                id
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
        id
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
  query getInventoryItemData($inventoryItemId: ID!) {
    inventoryItem(id: $inventoryItemId) {
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
