export declare const GET_ORDER_DATA = "\nquery getOrderData($getOrderId: ID!) {\n  order(id: $getOrderId) {\n          name\n                taxesIncluded\n                fullyPaid\n                discountCodes\n                displayFinancialStatus\n                createdAt\n                updatedAt\n                cancelledAt\n                fulfillments {\n                trackingInfo {\n                  company\n                      }\n                   }\n                billingAddress {\n                    address1\n                    address2\n                    city\n                    company\n                    country\n                    countryCode\n                    firstName\n                    lastName\n                    id\n                    name\n                    phone\n                    province\n                    provinceCode\n                    timeZone\n                    zip\n                    longitude\n                    latitude\n                    formattedArea\n                    countryCodeV2\n                    coordinatesValidated\n                }\n                shippingAddress {\n                    address1\n                    address2\n                    city\n                    company\n                    country\n                    coordinatesValidated\n                    countryCode\n                    countryCodeV2\n                    firstName\n                    formattedArea\n                    id\n                    lastName\n                    latitude\n                    longitude\n                    name\n                    phone\n                    province\n                    provinceCode\n                    timeZone\n                    zip\n                }\n                lineItems(first: 20) {\n                    edges {\n                        node {\n                            originalUnitPrice\n                            originalTotal\n                            originalTotalSet {\n                                presentmentMoney {\n                                    amount\n                                }\n                                shopMoney {\n                                    amount\n                                }\n                            }\n                            discountAllocations {\n                                allocatedAmount {\n                                    amount\n                                }\n                            }\n                            currentQuantity\n                            discountedTotal\n                            discountedUnitPrice\n                            fulfillableQuantity\n                            fulfillmentStatus\n                            id\n                            name\n                            nonFulfillableQuantity\n                            originalTotal\n                            originalUnitPrice\n                            quantity\n                            requiresShipping\n                            refundableQuantity\n                            restockable\n                            sku\n                            variantTitle\n                            vendor\n                            variant {\n                                id\n                            }\n                            product {\n                                id\n                            }\n                            taxLines {\n                                rate\n                            }\n                        }\n                    }\n                }\n                taxLines {\n                    channelLiable\n                    price\n                    priceSet {\n                        shopMoney {\n                            amount\n                            currencyCode\n                        }\n                    }\n                    rate\n                    ratePercentage\n                    title\n                }\n                totalWeight\n                customer {\n                    createdAt\n                    email\n                    displayName\n                    firstName\n                    hasTimelineComment\n                    id\n                    lastName\n                    tags\n                    taxExempt\n                    taxExemptions\n                    unsubscribeUrl\n                    updatedAt\n                    validEmailAddress\n                    verifiedEmail\n                    note\n                    multipassIdentifier\n                    numberOfOrders\n                    phone\n                    productSubscriberStatus\n                    legacyResourceId\n                    lifetimeDuration\n                    locale\n                    amountSpent {\n                        amount\n                        currencyCode\n                    }\n                    addresses {\n                        address1\n                        address2\n                        city\n                        coordinatesValidated\n                        company\n                        country\n                        countryCode\n                        countryCodeV2\n                        firstName\n                        formattedArea\n                        id\n                        lastName\n                        latitude\n                        longitude\n                        name\n                        phone\n                        provinceCode\n                        province\n                        timeZone\n                        zip\n                    }\n                }\n                shippingLines(first: 20) {\n                    edges {\n                        node {\n                            taxLines {\n                                price\n                            }\n                            discountedPrice {\n                                amount\n                            }\n                        }\n                    }\n                }\n                currentTotalPriceSet {\n                    shopMoney {\n                        amount\n                        currencyCode\n                    }\n                }\n                paymentGatewayNames\n                tags\n                id\n  }\n}\n";
export declare const GET_LOCATION_DATA = "\n  query getLocationData {\n    locations(first: 10) {\n        nodes {\n          id\n          name\n          address {\n          zip\n        }\n        isActive\n        }\n    }\n  }\n";
export declare function getProductsByIdsQuery(query: any): string;
export declare const GET_PRODUCT_DATA = "\nquery getProductData($shopifyProductId: ID!) {\n  product(id: $shopifyProductId) {\n    variants(first:10) {\n      nodes {\n        barcode\n        compareAtPrice\n        createdAt\n        taxable\n        title\n        sku\n        id\n        updatedAt\n        inventoryQuantity\n        inventoryPolicy\n        inventoryItem {\n          id\n        }\n        unitPriceMeasurement {\n          quantityUnit\n          measuredType\n          quantityValue\n          referenceUnit\n          referenceValue\n        }\n        price\n        position\n        product {\n          id\n        }\n      }\n    }\n  }\n}\n";
export declare const GET_INVENTORY_ITEM_DATA = "\n  query getInventoryItemData($inventoryItemId: ID!) {\n    inventoryItem(id: $inventoryItemId) {\n      id\n      sku\n      tracked\n      harmonizedSystemCode\n    }\n  }\n";
export declare const GET_ACCESS_SCOPE_DATA = "\nquery {\n      currentAppInstallation {\n         accessScopes {\n      handle\n      description\n    }\n        }\n      }\n";
export declare const GET_FULFILLMENT_ORDER_QUERY = "query getOrderData($getFulfillmentOrderId: ID!) {\n    order(id: $getFulfillmentOrderId) {\n       fulfillmentOrders(first:10) {\n           nodes {\n             id\n             assignedLocation {\n             location {\n               id\n             }\n           }\n           }\n         }\n     }\n    }\n   ";
export declare const GET_FULFILLMENT_LIST_COUNT_QUERY = "\n     query getFulfillmentListCount($fulfillmentId: ID!) {\n      order(id: $fulfillmentId) {\n     fulfillments {\n       status\n       trackingInfo {\n         company\n       }\n     }\n   }\n     }\n   ";
