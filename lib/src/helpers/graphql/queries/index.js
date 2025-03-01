"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHECK_ORDER_CANCEL_STATUS = exports.GET_FULFILLMENT_LIST_COUNT_QUERY = exports.GET_FULFILLMENT_ORDER_QUERY = exports.GET_ACCESS_SCOPE_DATA = exports.GET_INVENTORY_ITEM_DATA = exports.GET_PRODUCT_DATA = exports.getProductsByIdsQuery = exports.GET_LOCATION_DATA = exports.GET_ORDER_DATA = void 0;
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
                            inventoryItem {
                              requiresShipping
                              measurement{
                               weight{
                                unit
                                value
                               }
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
    let graphqlQuery = `query getProductsByIds($limit: Int!) {
    products(first: $limit`;
    if (query) {
        graphqlQuery += `, query: "${query}"`;
    }
    graphqlQuery += `) {
          nodes {
                id
                productType
                title
                status
                handle
                images(first: 10) {
                    edges {
                        node {
                            id
                            src
                        }
                    }
                }
                variants(first: 250) {
                        nodes {
                            inventoryItem {
                                id
                                measurement {
                                    weight {
                                        unit
                                        value
                                    }
                                }
                            }
                            title
                            updatedAt
                            createdAt
                            taxable
                            price
                            product {
                                id
                            }
                            inventoryQuantity
                            barcode
                            image {
                                id
                            }
                            sku
                            id
                        }
                    
                }
                createdAt
                updatedAt
                category {
                    fullName
                    id
                    isArchived
                }
            
        }
         pageInfo {
            hasNextPage
            endCursor
     }
    }
    
  }`;
    return graphqlQuery;
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
exports.GET_FULFILLMENT_ORDER_QUERY = `query getOrderData($fulfillmentOrderId: ID!) {
    order(id: $fulfillmentOrderId) {
       fulfillmentOrders(first:250) {
           nodes {
             id
             status
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
exports.CHECK_ORDER_CANCEL_STATUS = `
  query checkOrderCancelStatus($jobId: ID!) {
        job(id: $jobId) {
          id
          done
        }
}`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvaGVscGVycy9ncmFwaHFsL3F1ZXJpZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxjQUFjLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBMk03QixDQUFDO0FBRVcsUUFBQSxpQkFBaUIsR0FBRzs7Ozs7Ozs7Ozs7OztDQWFoQyxDQUFDO0FBRUYsU0FBZ0IscUJBQXFCLENBQUMsS0FBSztJQUN6QyxJQUFJLFlBQVksR0FBRzsyQkFDTSxDQUFDO0lBRTFCLElBQUksS0FBSyxFQUFFO1FBQ1QsWUFBWSxJQUFJLGFBQWEsS0FBSyxHQUFHLENBQUM7S0FDdkM7SUFFRCxZQUFZLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkRkLENBQUM7SUFFSCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBdEVELHNEQXNFQztBQUVZLFFBQUEsZ0JBQWdCLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FrQy9CLENBQUM7QUFFVyxRQUFBLHVCQUF1QixHQUFHOzs7Ozs7Ozs7Q0FTdEMsQ0FBQztBQUVXLFFBQUEscUJBQXFCLEdBQUc7Ozs7Ozs7OztDQVNwQyxDQUFDO0FBRVcsUUFBQSwyQkFBMkIsR0FBRzs7Ozs7Ozs7Ozs7Ozs7O0lBZXZDLENBQUM7QUFFUSxRQUFBLGdDQUFnQyxHQUFHOzs7Ozs7Ozs7OztJQVc1QyxDQUFDO0FBRVEsUUFBQSx5QkFBeUIsR0FBRzs7Ozs7O0VBTXZDLENBQUMifQ==