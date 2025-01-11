"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_FULFILLMENT_LIST_COUNT_QUERY = exports.GET_FULFILLMENT_ORDER_QUERY = exports.GET_ACCESS_SCOPE_DATA = exports.GET_INVENTORY_ITEM_DATA = exports.GET_PRODUCT_DATA = exports.getProductsByIdsQuery = exports.GET_LOCATION_DATA = exports.GET_ORDER_DATA = void 0;
exports.GET_ORDER_DATA = `
query getOrderData($getOrderId: ID!) {
  order(id: $getOrderId) {
                name
                taxesIncluded
                fullyPaid
                discountCodes
                displayFinancialStatus
                createdAt
                updatedAt
                cancelledAt
                fulfillments {
                  trackingInfo {
                    company
                  }
                }
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
                                ratePercentage
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
function getProductsByIdsQuery(query) {
    return `query getProductsByIds($limit: Int!) {
  products(query: "${query}", first: $limit) {
    nodes {
      id
      title
      variants(first: 250) {
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
}
exports.getProductsByIdsQuery = getProductsByIdsQuery;
exports.GET_PRODUCT_DATA = `
query getProductData($shopifyProductId: ID!) {
  product(id: $shopifyProductId) {
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
exports.GET_INVENTORY_ITEM_DATA = `
  query getInventoryItemData($inventoryItemId: ID!) {
    inventoryItem(id: $inventoryItemId) {
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
       fulfillmentOrders(first:250) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy9ncmFwaHFsL3F1ZXJpZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxjQUFjLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQW1NN0IsQ0FBQztBQUVXLFFBQUEsaUJBQWlCLEdBQUc7Ozs7Ozs7Ozs7Ozs7Q0FhaEMsQ0FBQztBQUVGLFNBQWdCLHFCQUFxQixDQUFDLEtBQUs7SUFDekMsT0FBTztxQkFDWSxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7R0FldkIsQ0FBQztBQUNKLENBQUM7QUFsQkQsc0RBa0JDO0FBRVksUUFBQSxnQkFBZ0IsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQWtDL0IsQ0FBQztBQUVXLFFBQUEsdUJBQXVCLEdBQUc7Ozs7Ozs7OztDQVN0QyxDQUFDO0FBRVcsUUFBQSxxQkFBcUIsR0FBRzs7Ozs7Ozs7O0NBU3BDLENBQUM7QUFFVyxRQUFBLDJCQUEyQixHQUFHOzs7Ozs7Ozs7Ozs7OztJQWN2QyxDQUFDO0FBRVEsUUFBQSxnQ0FBZ0MsR0FBRzs7Ozs7Ozs7Ozs7SUFXNUMsQ0FBQyJ9