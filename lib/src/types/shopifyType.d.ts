export = ShopifyTypes;
declare class ShopifyTypes {
    constructor(config: ShopifyTypes.IPublicShopifyConfig | ShopifyTypes.IPrivateShopifyConfig);
    callLimits: ShopifyTypes.ICallLimits;
    callGraphqlLimits: ShopifyTypes.ICallGraphqlLimits;
    accessScope: {
        list: () => Promise<ShopifyTypes.IAccessScope[]>;
    };
    apiPermission: {
        delete: () => Promise<void>;
    };
    applicationCharge: {
        activate: (id: number, params?: any) => Promise<ShopifyTypes.IApplicationCharge>;
        create: (params: ShopifyTypes.ICreateApplicationCharge) => Promise<ShopifyTypes.IApplicationCharge>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IApplicationCharge>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IApplicationCharge>>;
    };
    applicationCredit: {
        create: (params: ShopifyTypes.ICreateApplicationCredit) => Promise<ShopifyTypes.IApplicationCredit>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IApplicationCredit>;
        list: (params?: any) => Promise<ShopifyTypes.IApplicationCredit[]>;
    };
    article: {
        authors: () => Promise<string[]>;
        count: (blogId: number, params?: any) => Promise<number>;
        create: (blogId: number, params: ShopifyTypes.ICreateArticle) => Promise<ShopifyTypes.IArticle>;
        delete: (blogId: number, id: number) => Promise<void>;
        get: (blogId: number, id: number, params?: any) => Promise<ShopifyTypes.IArticle>;
        list: (blogId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IArticle>>;
        tags: (blogId?: number, params?: any) => Promise<string[]>;
        update: (blogId: number, id: number, params: ShopifyTypes.IUpdateArticle) => Promise<ShopifyTypes.IArticle>;
    };
    asset: {
        create: (themeId: number, params: any) => Promise<ShopifyTypes.IAsset>;
        delete: (themeId: number, params: any) => Promise<void>;
        get: (themeId: number, params?: any) => Promise<ShopifyTypes.IAsset>;
        list: (themeId: number, params?: any) => Promise<ShopifyTypes.IAsset[]>;
        update: (themeId: number, params: ShopifyTypes.IUpdateAsset) => Promise<ShopifyTypes.IAsset>;
    };
    balance: {
        list: () => Promise<ShopifyTypes.IBalance[]>;
        transactions: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IBalanceTransaction>>;
    };
    blog: {
        count: () => Promise<number>;
        create: (params: ShopifyTypes.ICreateBlog) => Promise<ShopifyTypes.IBlog>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IBlog>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IBlog>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IBlog>;
    };
    cancellationRequest: {
        create: (fulfillmentOrderId: number, message?: string) => Promise<ShopifyTypes.IFulfillmentOrder>;
        accept: (fulfillmentOrderId: number, message?: string) => Promise<ShopifyTypes.IFulfillmentOrder>;
        reject: (fulfillmentOrderId: number, message?: string) => Promise<ShopifyTypes.IFulfillmentOrder>;
    };
    carrierService: {
        create: (params: ShopifyTypes.ICreateCarrierService) => Promise<ShopifyTypes.ICarrierService>;
        delete: (id: number) => Promise<void>;
        get: (id: number) => Promise<ShopifyTypes.ICarrierService>;
        list: () => Promise<ShopifyTypes.ICarrierService[]>;
        update: (id: number, params: ShopifyTypes.IUpdateCarrierService) => Promise<ShopifyTypes.ICarrierService>;
    };
    checkout: {
        complete: (token: string) => Promise<any>;
        count: (params?: any) => Promise<number>;
        create: (params?: any) => Promise<ShopifyTypes.ICheckout>;
        get: (token: string) => Promise<ShopifyTypes.ICheckout>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICheckout>>;
        shippingRates: (token: string) => Promise<any>;
        update: (token: any, params: any) => Promise<ShopifyTypes.ICheckout>;
    };
    collect: {
        count: (params?: any) => Promise<number>;
        create: (params: ShopifyTypes.ICreateCollect) => Promise<ShopifyTypes.ICollect>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICollect>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICollect>>;
    };
    collection: {
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICollection>;
        products: (id: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IProduct>>;
    };
    collectionListing: {
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICollectionListing>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICollectionListing>>;
        productIds: (id: number, params?: any) => Promise<any>;
    };
    comment: {
        approve: (id: number) => Promise<ShopifyTypes.IComment>;
        count: (params?: any) => Promise<number>;
        create: (params: ShopifyTypes.ICreateComment) => Promise<ShopifyTypes.IComment>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IComment>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IComment>>;
        notSpam: (id: number) => Promise<ShopifyTypes.IComment>;
        remove: (id: number) => Promise<ShopifyTypes.IComment>;
        restore: (id: number) => Promise<ShopifyTypes.IComment>;
        spam: (id: number) => Promise<ShopifyTypes.IComment>;
        update: (id: number, params: ShopifyTypes.IUpdateComment) => Promise<ShopifyTypes.IComment>;
    };
    country: {
        count: () => Promise<number>;
        create: (params: ShopifyTypes.ICreateCountry) => Promise<ShopifyTypes.ICountry>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICountry>;
        list: (params?: any) => Promise<ShopifyTypes.ICountry[]>;
        update: (id: number, params: ShopifyTypes.IUpdateCountry) => Promise<ShopifyTypes.ICountry>;
    };
    currency: {
        list: () => Promise<ShopifyTypes.ICurrency[]>;
    };
    customCollection: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.ICustomCollection>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICustomCollection>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICustomCollection>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.ICustomCollection>;
    };
    customer: {
        accountActivationUrl: (id: number) => Promise<any>;
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.ICustomer>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICustomer>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICustomer>>;
        search: (params: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICustomer>>;
        sendInvite: (id: number, params?: ShopifyTypes.ICustomerSendInvite) => Promise<ShopifyTypes.ICustomerSendInvite>;
        update: (id: number, params: any) => Promise<ShopifyTypes.ICustomer>;
        orders: (id: number, params?: any) => Promise<ShopifyTypes.IOrder[]>;
    };
    customerAddress: {
        create: (customerId: number, params: any) => Promise<ShopifyTypes.ICustomerAddress>;
        default: (customerId: number, id: number) => Promise<ShopifyTypes.ICustomerAddress>;
        delete: (customerId: number, id: number) => Promise<void>;
        get: (customerId: number, id: number) => Promise<ShopifyTypes.ICustomerAddress>;
        list: (customerId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICustomerAddress>>;
        set: (customerId: number, params: any) => Promise<any>;
        update: (customerId: number, id: number, params: any) => Promise<ShopifyTypes.ICustomerAddress>;
    };
    customerSavedSearch: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.ICustomerSavedSearch>;
        customers: (id: number, params?: any) => Promise<any>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.ICustomerSavedSearch>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ICustomerSavedSearch>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.ICustomerSavedSearch>;
    };
    deprecatedApiCall: {
        list: () => Promise<ShopifyTypes.IDeprecatedApiCall[]>;
    };
    discountCode: {
        create: (priceRuleId: number, params: any) => Promise<ShopifyTypes.IDiscountCode>;
        delete: (priceRuleId: number, id: number) => Promise<void>;
        get: (priceRuleId: number, id: number) => Promise<ShopifyTypes.IDiscountCode>;
        list: (priceRuleId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IDiscountCode>>;
        lookup: (params: any) => Promise<ShopifyTypes.IDiscountCode>;
        update: (priceRuleId: number, id: number, params?: any) => Promise<ShopifyTypes.IDiscountCode>;
    };
    discountCodeCreationJob: {
        create: (priceRuleId: number, params: any[]) => Promise<ShopifyTypes.IDiscountCodeCreation>;
        discountCodes: (priceRuleId: number, id: number) => Promise<any[]>;
        get: (priceRuleId: number, id: number) => Promise<ShopifyTypes.IDiscountCodeCreation>;
    };
    dispute: {
        get: (id: number) => Promise<ShopifyTypes.IDispute>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IDispute>>;
    };
    disputeEvidence: {
        get: (disputeId: number) => Promise<ShopifyTypes.IDisputeEvidence>;
        update: (disputeId: number, params: ShopifyTypes.IUpdateDisputeEvidence) => Promise<ShopifyTypes.IDisputeEvidence>;
    };
    disputeFileUpload: {
        create: (disputeId: number, params: ShopifyTypes.ICreateDisputeFileUpload) => Promise<ShopifyTypes.IDisputeFileUpload>;
        delete: (id: number) => Promise<void>;
    };
    draftOrder: {
        complete: (id: number, params?: any) => Promise<ShopifyTypes.IDraftOrder>;
        count: () => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IDraftOrder>;
        delete: (id: number) => Promise<void>;
        get: (id: number) => Promise<ShopifyTypes.IDraftOrder>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IDraftOrder>>;
        sendInvoice: (id: number, params?: any) => Promise<any>;
        update: (id: number, params?: any) => Promise<ShopifyTypes.IDraftOrder>;
    };
    event: {
        count: (params?: any) => Promise<number>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IEvent>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IEvent>>;
    };
    fulfillment: {
        cancel: (orderId: number, id: number) => Promise<ShopifyTypes.IFulfillment>;
        cancelV2: (id: number) => Promise<ShopifyTypes.IFulfillment>;
        complete: (orderId: number, id: number) => Promise<ShopifyTypes.IFulfillment>;
        count: (orderId: number, params?: any) => Promise<number>;
        create: (orderId: number, params: any) => Promise<ShopifyTypes.IFulfillment>;
        createV2: (params: any) => Promise<ShopifyTypes.IFulfillment>;
        get: (orderId: number, id: number, params?: any) => Promise<ShopifyTypes.IFulfillment>;
        list: (orderId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IFulfillment>>;
        open: (orderId: number, id: number) => Promise<ShopifyTypes.IFulfillment>;
        update: (orderId: number, id: number, params: any) => Promise<ShopifyTypes.IFulfillment>;
        updateTracking: (id: number, params: any) => Promise<ShopifyTypes.IFulfillment>;
    };
    fulfillmentEvent: {
        create: (orderId: number, fulfillmentId: number, params: any) => Promise<ShopifyTypes.IFulfillmentEvent>;
        delete: (orderId: number, fulfillmentId: number, id: number) => Promise<void>;
        get: (orderId: number, fulfillmentId: number, id: number) => Promise<ShopifyTypes.IFulfillmentEvent>;
        list: (orderId: number, fulfillmentId: number, params?: any) => Promise<ShopifyTypes.IFulfillmentEvent[]>;
        update: (orderId: number, fulfillmentId: number, id: number, params: any) => Promise<ShopifyTypes.IFulfillmentEvent>;
    };
    fulfillmentOrder: {
        cancel: (id: number, params: ShopifyTypes.IFulfillmentOrder) => Promise<ShopifyTypes.IFulfillmentOrder>;
        close: (id: number, message?: string) => Promise<ShopifyTypes.IFulfillmentOrder>;
        get: (id: number) => Promise<ShopifyTypes.IFulfillmentOrder>;
        list: (params?: any) => Promise<ShopifyTypes.IFulfillmentOrder[]>;
        locationsForMove: (id: number) => Promise<ShopifyTypes.ILocationForMove[]>;
        move: (id: number, locationId: number) => Promise<ShopifyTypes.IFulfillmentOrder>;
        setFulfillmentOrdersDeadline: (params: ShopifyTypes.ISetFulfillmentOrdersDeadline) => Promise<void>;
        fulfillments: (id: number) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IFulfillment>>;
    };
    fulfillmentRequest: {
        accept: (fulfillmentOrderId: number, message?: string) => Promise<ShopifyTypes.IFulfillmentOrder>;
        create: (fulfillmentOrderId: number, params: ShopifyTypes.ICreateFulfillmentRequest) => Promise<ShopifyTypes.IFulfillmentOrder>;
        reject: (fulfillmentOrderId: number, message?: string) => Promise<ShopifyTypes.IFulfillmentOrder>;
    };
    fulfillmentService: {
        create: (params: any) => Promise<ShopifyTypes.IFulfillmentService>;
        delete: (id: number) => Promise<void>;
        get: (id: number) => Promise<ShopifyTypes.IFulfillmentService>;
        list: (params?: any) => Promise<ShopifyTypes.IFulfillmentService[]>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IFulfillmentService>;
    };
    giftCard: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IGiftCard>;
        disable: (id: number) => Promise<any>;
        get: (id: number) => Promise<ShopifyTypes.IGiftCard>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IGiftCard>>;
        search: (params: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IGiftCard>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IGiftCard>;
    };
    giftCardAdjustment: {
        create: (giftCardId: number, params: any) => Promise<ShopifyTypes.IGiftCardAdjustment>;
        get: (giftCardId: number, id: number) => Promise<ShopifyTypes.IGiftCardAdjustment>;
        list: (giftCardId: number) => Promise<ShopifyTypes.IGiftCardAdjustment[]>;
    };
    graphql: (data: string, variables?: any) => Promise<any>;
    inventoryItem: {
        get: (id: number) => Promise<ShopifyTypes.IInventoryItem>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IInventoryItem>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IInventoryItem>;
    };
    inventoryLevel: {
        adjust: (params: any) => Promise<ShopifyTypes.IInventoryLevel>;
        connect: (params: any) => Promise<ShopifyTypes.IInventoryLevel>;
        delete: (params: any) => Promise<void>;
        list: (params: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IInventoryLevel>>;
        set: (params: any) => Promise<ShopifyTypes.IInventoryLevel>;
    };
    location: {
        count: () => Promise<number>;
        get: (id: number) => Promise<ShopifyTypes.ILocation>;
        inventoryLevels: (id: number, params?: any) => Promise<ShopifyTypes.IInventoryLevel[]>;
        list: () => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ILocation>>;
    };
    marketingEvent: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IMarketingEvent>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IMarketingEvent>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IMarketingEvent>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IMarketingEvent>;
        engagements: (id: number, params: any) => Promise<any>;
    };
    metafield: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IMetafield>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IMetafield>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IMetafield>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IMetafield>;
    };
    on(event: "callLimits", callback: (limits: ShopifyTypes.ICallLimits) => void): ShopifyTypes;
    on(event: "callGraphqlLimits", callback: (limits: ShopifyTypes.ICallGraphqlLimits) => void): ShopifyTypes;
    order: {
        cancel: (id: number, params?: any) => Promise<ShopifyTypes.IOrder>;
        close: (id: number) => Promise<ShopifyTypes.IOrder>;
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IOrder>;
        delete: (id: number) => Promise<any>;
        fulfillmentOrders: (id: number) => Promise<ShopifyTypes.IFulfillmentOrder[]>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IOrder>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IOrder>>;
        open: (id: number) => Promise<ShopifyTypes.IOrder>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IOrder>;
    };
    orderRisk: {
        create: (orderId: number, params: any) => Promise<ShopifyTypes.IOrderRisk>;
        delete: (orderId: number, id: number) => Promise<void>;
        get: (orderId: number, id: number) => Promise<ShopifyTypes.IOrderRisk>;
        list: (orderId: number) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IOrderRisk>>;
        update: (orderId: number, id: number, params: any) => Promise<ShopifyTypes.IOrderRisk>;
    };
    page: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IPage>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IPage>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IPage>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IPage>;
    };
    payment: {
        count: (checkoutToken: string) => Promise<number>;
        create: (checkoutToken: string, params: any) => Promise<any>;
        get: (checkoutToken: string, id: number) => Promise<any>;
        list: (checkoutToken?: string) => Promise<any>;
    };
    payout: {
        get: (id: number) => Promise<ShopifyTypes.IPayout>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IPayout>>;
    };
    policy: {
        list: (params?: any) => Promise<ShopifyTypes.IPolicy[]>;
    };
    priceRule: {
        create: (params: any) => Promise<ShopifyTypes.IPriceRule>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IPriceRule>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IPriceRule>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IPriceRule>;
    };
    product: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.IProduct>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IProduct>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IProduct>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IProduct>;
    };
    productImage: {
        count: (productId: number, params?: any) => Promise<number>;
        create: (productId: number, params: any) => Promise<ShopifyTypes.IProductImage>;
        delete: (productId: number, id: number) => Promise<void>;
        get: (productId: number, id: number, params?: any) => Promise<ShopifyTypes.IProductImage>;
        list: (productId: number, params?: any) => Promise<ShopifyTypes.IProductImage[]>;
        update: (productId: number, id: number, params: any) => Promise<ShopifyTypes.IProductImage>;
    };
    productListing: {
        count: () => Promise<number>;
        create: (productId: number, params: any) => Promise<ShopifyTypes.IProductListing>;
        delete: (productId: number) => Promise<void>;
        get: (productId: number) => Promise<ShopifyTypes.IProductListing>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IProductListing>>;
        productIds: (params?: any) => Promise<any>;
    };
    productResourceFeedback: {
        create: (productId: number, params: any) => Promise<ShopifyTypes.IResourceFeedback>;
        list: (productId: number, params?: any) => Promise<ShopifyTypes.IResourceFeedback[]>;
    };
    productVariant: {
        count: (productId: number) => Promise<number>;
        create: (productId: number, params: any) => Promise<ShopifyTypes.IProductVariant>;
        delete: (productId: number, id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IProductVariant>;
        list: (productId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IProductVariant>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IProductVariant>;
    };
    province: {
        count: (countryId: number, params?: any) => Promise<number>;
        get: (countryId: number, id: number, params?: any) => Promise<ShopifyTypes.IProvince>;
        list: (countryId: number, params?: any) => Promise<ShopifyTypes.IProvince[]>;
        update: (countryId: number, id: number, params: any) => Promise<ShopifyTypes.IProvince>;
    };
    recurringApplicationCharge: {
        activate: (id: number, params: any) => Promise<ShopifyTypes.IRecurringApplicationCharge>;
        create: (params: ShopifyTypes.ICreateRecurringApplicationCharge) => Promise<ShopifyTypes.IRecurringApplicationCharge>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IRecurringApplicationCharge>;
        list: (params?: any) => Promise<ShopifyTypes.IRecurringApplicationCharge[]>;
        customize: (id: number, params: any) => Promise<ShopifyTypes.IRecurringApplicationCharge>;
    };
    redirect: {
        count: (params?: any) => Promise<number>;
        create: (params: ShopifyTypes.ICreateRedirect) => Promise<ShopifyTypes.IRedirect>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IRedirect>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IRedirect>>;
        update: (id: number, params: ShopifyTypes.IUpdateRedirect) => Promise<ShopifyTypes.IRedirect>;
    };
    refund: {
        calculate: (orderId: number, params: any) => Promise<any>;
        create: (orderId: number, params: any) => Promise<ShopifyTypes.IRefund>;
        get: (orderId: number, id: number, params?: any) => Promise<ShopifyTypes.IRefund>;
        list: (orderId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IRefund>>;
    };
    report: {
        create: (params: any) => Promise<ShopifyTypes.IReport>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IReport>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IReport>>;
        update: (id: number, params: any) => Promise<ShopifyTypes.IReport>;
    };
    resourceFeedback: {
        create: (params: any) => Promise<ShopifyTypes.IResourceFeedback>;
        list: () => Promise<ShopifyTypes.IResourceFeedback[]>;
    };
    scriptTag: {
        count: (params?: any) => Promise<number>;
        create: (params: ShopifyTypes.ICreateScriptTag) => Promise<ShopifyTypes.IScriptTag>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IScriptTag>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IScriptTag>>;
        update: (id: number, params: ShopifyTypes.IUpdateScriptTag) => Promise<ShopifyTypes.IScriptTag>;
    };
    shippingZone: {
        list: (params?: any) => Promise<ShopifyTypes.IShippingZone[]>;
    };
    shop: {
        get: (params?: any) => Promise<ShopifyTypes.IShop>;
    };
    smartCollection: {
        count: (params?: any) => Promise<number>;
        create: (params: any) => Promise<ShopifyTypes.ISmartCollection>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.ISmartCollection>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ISmartCollection>>;
        order: (id: number, params: any) => Promise<void>;
        products: (id: number, params: any) => Promise<ShopifyTypes.IProduct>;
        update: (id: number, params: any) => Promise<ShopifyTypes.ISmartCollection>;
    };
    storefrontAccessToken: {
        create: (params: any) => Promise<ShopifyTypes.IStorefrontAccessToken>;
        delete: (id: number) => Promise<void>;
        list: () => Promise<ShopifyTypes.IStorefrontAccessToken[]>;
    };
    tenderTransaction: {
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ITenderTransaction>>;
    };
    theme: {
        create: (params: any) => Promise<ShopifyTypes.ITheme>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params: any) => Promise<ShopifyTypes.ITheme>;
        list: (params?: any) => Promise<ShopifyTypes.ITheme[]>;
        update: (id: number, params: any) => Promise<ShopifyTypes.ITheme>;
    };
    transaction: {
        count: (orderId: number) => Promise<number>;
        create: (orderId: number, params: any) => Promise<ShopifyTypes.ITransaction>;
        get: (orderId: number, id: number, params?: any) => Promise<ShopifyTypes.ITransaction>;
        list: (orderId: number, params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.ITransaction>>;
    };
    usageCharge: {
        create: (recurringApplicationChargeId: number, params: ShopifyTypes.ICreateUsageCharge) => Promise<ShopifyTypes.IUsageCharge>;
        get: (recurringApplicationChargeId: number, id: number, params?: any) => Promise<ShopifyTypes.IUsageCharge>;
        list: (recurringApplicationChargeId: number, params?: any) => Promise<ShopifyTypes.IUsageCharge[]>;
    };
    user: {
        current: () => Promise<ShopifyTypes.IUser>;
        get: (id: number) => Promise<ShopifyTypes.IUser>;
        list: () => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IUser>>;
    };
    webhook: {
        count: (params?: any) => Promise<number>;
        create: (params: ShopifyTypes.ICreateWebhook) => Promise<ShopifyTypes.IWebhook>;
        delete: (id: number) => Promise<void>;
        get: (id: number, params?: any) => Promise<ShopifyTypes.IWebhook>;
        list: (params?: any) => Promise<ShopifyTypes.IPaginatedResult<ShopifyTypes.IWebhook>>;
        update: (id: number, params: ShopifyTypes.IUpdateWebhook) => Promise<ShopifyTypes.IWebhook>;
    };
}
declare namespace ShopifyTypes {
    interface IAutoLimit {
        bucketSize: number;
        calls: number;
        interval: number;
    }
    interface IPublicShopifyConfig {
        accessToken: string;
        apiVersion?: string;
        autoLimit?: boolean | IAutoLimit;
        maxRetries?: number;
        presentmentPrices?: boolean;
        shopName: string;
        timeout?: number;
        hooks?: any;
    }
    interface IPrivateShopifyConfig {
        apiKey: string;
        apiVersion?: string;
        autoLimit?: boolean | IAutoLimit;
        maxRetries?: number;
        password: string;
        presentmentPrices?: boolean;
        shopName: string;
        timeout?: number;
        hooks?: any;
    }
    interface ICallLimits {
        remaining: number;
        current: number;
        max: number;
    }
    interface ICallGraphqlLimits {
        actualQueryCost: number;
        current: number;
        max: number;
        remaining: number;
        requestedQueryCost: number;
        restoreRate: number;
    }
    interface IAccessScope {
        handle: string;
    }
    interface ICheckout {
        abandoned_checkout_url: string;
        applied_discount?: ICheckoutDiscount;
        billing_address?: ICustomerAddress;
        buyer_accepts_marketing: boolean;
        cancel_reason?: "customer" | "fraud" | "inventory" | "other" | null;
        cart_token: string;
        closed_at: string | null;
        completed_at: string | null;
        created_at: string;
        currency: string;
        customer: ICustomer;
        customer_id: number;
        customer_locale: string;
        discount_code?: string;
        discount_codes?: ICheckoutDiscount[];
        device_id: number | null;
        email: string;
        gateway: string | null;
        gift_cards?: ICheckoutGiftCard;
        id: number;
        landing_site: string;
        line_items: ICheckoutLineItem[];
        location_id: number | null;
        note: string | null;
        note_attributes: any[];
        order?: ICheckoutOrder;
        payment_due: string;
        payment_url?: string;
        phone: string | null;
        presentment_currency: string;
        referring_site: string;
        request_details?: ICheckoutRequestDetails;
        requires_shipping?: boolean;
        reservation_time?: number;
        reservation_time_left?: number;
        shipping_address: ICustomerAddress;
        shipping_lines: ICheckoutShippingLine[];
        shipping_rates?: ICheckoutShippingRate[];
        shipping_rate?: ICheckoutShippingRate[];
        source_indentifier: string | null;
        source_name: string | null;
        source_url: string | null;
        subtotal_price: string;
        tax_lines: ICheckoutTaxLine[];
        taxes_included: boolean;
        token: string;
        total_discounts: string;
        total_line_items_price: string;
        total_price: string;
        total_tax: string;
        total_weight: number;
        updated_at: string;
        user_id: number | null;
        web_url?: string;
    }
    interface ICheckoutLineItem {
        applied_discounts: any[];
        compare_at_price: string | null;
        destination_location_id: number;
        discount_codes: any[];
        fulfillment_service: "api" | "custom" | "legacy" | "manual";
        fulfillment_status?: "fulfilled" | "partial" | null;
        gift_card: boolean;
        grams: number;
        key: string;
        line_price: string;
        name: string;
        origin_location_id: number;
        price: string;
        product_id: number;
        properties: any | null;
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        tax_lines: ICheckoutTaxLine[];
        title: string;
        variant_id: number;
        variant_title: string;
        vendor: string;
    }
    interface ICheckoutShippingLine {
        api_client_id: number | null;
        applied_discounts: any[];
        carrier_identifier: any | null;
        carrier_service_id: number | null;
        code: string;
        delivery_category: any | null;
        id: string;
        markup: string;
        phone: string | null;
        price: string;
        requested_fulfillment_service_id: number | null;
        source: string;
        tax_lines: any[];
        title: string;
        validation_context: any | null;
    }
    interface ICheckoutTaxLine {
        compare_at: number;
        position: number;
        price: string;
        rate: number;
        source: string;
        title: string;
        zone: string;
    }
    type ApplicationChargeStatus = "accepted" | "active" | "declined" | "expired" | "pending";
    interface IApplicationCharge {
        confirmation_url: string;
        created_at: string;
        id: number;
        name: string;
        price: string;
        return_url: string;
        status: ApplicationChargeStatus;
        test: boolean | null;
        updated_at: string;
    }
    interface ICreateApplicationCharge {
        name: string;
        price: string;
        return_url: string;
        status: ApplicationChargeStatus;
        test?: true;
    }
    interface IApplicationCredit {
        amount: string;
        description: string;
        id: number;
        test: boolean | null;
    }
    interface ICreateApplicationCredit {
        description: string;
        amount: string;
        test?: true;
    }
    interface IArticle {
        author: string;
        blog_id: number;
        body_html: string;
        created_at: string;
        id: number;
        handle: string;
        image: IImage;
        metafields: IObjectMetafield[];
        published: boolean;
        published_at: string;
        summary_html: string | null;
        tags: string;
        template_suffix: string | null;
        title: string;
        updated_at: string;
        user_id: number;
    }
    interface ICreateArticle {
        author: string;
        body_html: string;
        handle?: string;
        image?: IBase64Image;
        metafields?: ICreateObjectMetafield[];
        published?: boolean;
        published_at?: string;
        summary_html?: string | null;
        tags?: string;
        template_suffix?: string | null;
        title: string;
        user_id?: number;
    }
    interface IUpdateArticle {
        author: string;
        body_html: string;
        handle?: string;
        image?: IBase64Image;
        metafields?: ICreateObjectMetafield[];
        published?: boolean;
        published_at?: string;
        summary_html?: string | null;
        tags?: string;
        template_suffix?: string | null;
        title: string;
        user_id?: number;
    }
    interface IImage {
        created_at: string;
        height: number;
        src: string;
        updated_at?: string;
        width: number;
        alt: string | null;
    }
    interface IBase64Image {
        attachment: string;
    }
    interface IObjectMetafield {
        key: string;
        namespace: string;
        value: string | number;
        value_type: "string" | "integer";
        description: string | null;
    }
    interface ICreateObjectMetafield {
        key: string;
        namespace: string;
        value: string | number;
        value_type: "string" | "integer";
        description?: string | null;
    }
    interface IAsset {
        attachment?: string;
        content_type: string;
        created_at: string;
        key: string;
        public_url: string;
        size: number;
        source_key: string;
        src: string;
        theme_id: number;
        updated_at: string;
        value?: string;
    }
    interface IUpdateAsset {
        attachment?: string;
        key: string;
        source_key?: string;
        src?: string;
        value?: string;
    }
    type BalanceTransactionType = "charge" | "refund" | "dispute" | "reserve" | "adjustment" | "credit" | "debit" | "payout" | "payout_failure" | "payout_cancellation";
    type BalanceTransactionSourceType = "charge" | "refund" | "dispute" | "reserve" | "adjustment" | "payout";
    interface IBalanceTransaction {
        id: number;
        type: BalanceTransactionType;
        test: boolean;
        payout_id: number;
        payout_status: string;
        currency: string;
        amount: string;
        fee: string;
        net: string;
        source_id: number;
        source_type: BalanceTransactionSourceType;
        source_order_transaction_id: number | null;
        source_order_id: number | null;
        processed_at: string;
    }
    interface IBalance {
        currency: string;
        amount: string;
    }
    interface IBlog {
        commentable: "moderate" | "no" | "yes";
        created_at: string;
        feedburner: string | null;
        feedburner_location: string | null;
        handle: string;
        id: number;
        metafield: IObjectMetafield[];
        tags: string;
        template_suffix: string | null;
        title: string;
        updated_at: string;
    }
    interface ICreateBlog {
        commentable?: "moderate" | "no" | "yes";
        feedburner?: string | null;
        feedburner_location?: string | null;
        handle?: string;
        metafield?: ICreateObjectMetafield[];
        tags?: string;
        template_suffix?: string | null;
        title: string;
    }
    interface ICarrierService {
        id: number;
        active: boolean;
        callback_url: string;
        carrier_service_type: string;
        name: string;
        service_discovery: boolean;
        format: "json" | "xml";
    }
    interface ICreateCarrierService {
        active?: boolean;
        callback_url: string;
        carrier_service_type?: string;
        name: string;
        service_discovery: boolean;
        format?: "json" | "xml";
    }
    interface IUpdateCarrierService {
        active?: boolean;
        callback_url?: string;
        carrier_service_type?: string;
        name?: string;
        service_discovery?: boolean;
        format?: "json" | "xml";
    }
    interface ICheckoutDiscount {
        amount: string;
        applicable: boolean;
        description: string;
        non_applicable_reason: string;
        title: string;
        value: string;
        value_type: "fixed_amount" | "percentage";
    }
    interface ICheckoutGiftCard {
        amount_used: string;
        balance: string;
        id: string;
        last_characters: string;
    }
    interface ICheckoutShippingRateCheckout {
        subtotal_price: string;
        total_price: string;
        total_tax: string;
    }
    interface ICheckoutShippingRate {
        checkout: ICheckoutShippingRateCheckout;
        delivery_range: string[];
        handle: string;
        price: string;
        requires_phone: boolean;
        title: string;
    }
    interface ICheckoutOrder {
        id: number;
        name: string;
        status_url: string;
    }
    interface ICheckoutRequestDetails {
        accept_language: string;
        ip_address: string;
        user_agent: string;
    }
    interface ICollect {
        collection_id: number;
        created_at: string;
        featured: boolean;
        id: number;
        position: number;
        product_id: number;
        sort_value: string;
        updated_at: string;
    }
    interface ICreateCollect {
        collection_id: number;
        featured?: boolean;
        position?: number;
        product_id: number;
        sort_value?: string;
    }
    interface ICollection {
        admin_graphql_api_id: string;
        body_html: string;
        collection_type: string;
        handle: string;
        id: number;
        image: IImage;
        products_count: number;
        published_at: string;
        published_scope: string;
        sort_order: string;
        template_suffix: string | null;
        title: string;
        updated_at: string;
    }
    type CollectionListingSortOrder = "alpha-asc" | "alpha-desc" | "best-selling" | "created" | "created-desc" | "manual" | "price-asc" | "price-desc";
    interface ICollectionListingImage extends IImage {
        position: number;
        product_it: number;
        variant_ids: number[];
    }
    interface ICollectionListing {
        collection_id: number;
        body_html: string;
        default_product_image: ICollectionListingImage;
        image: IImage;
        handle: string;
        published_at: string;
        title: string;
        sort_order: CollectionListingSortOrder;
        updated_at: string;
    }
    type CommentStatus = "published" | "removed" | "spam" | "unapproved";
    interface IComment {
        article_id: number;
        author: string;
        blog_id: number;
        body: string;
        body_html: string;
        created_at: string;
        email: string;
        id: number;
        ip: string;
        published_at: string;
        status: CommentStatus;
        updated_at: string;
        user_agent: string;
    }
    interface ICreateComment {
        article_id?: number;
        author: string;
        blog_id?: number;
        body?: string;
        body_html?: string;
        email: string;
        ip?: string;
        published_at?: string;
        status?: CommentStatus;
        user_agent?: string;
    }
    interface IUpdateComment {
        article_id?: number;
        author?: string;
        blog_id?: number;
        body?: string;
        body_html?: string;
        email?: string;
        ip?: string;
        published_at?: string;
        status?: CommentStatus;
        user_agent?: string;
    }
    interface ICountry {
        code: string;
        id: number;
        name: string;
        provinces: IProvince[];
        tax: number;
        tax_name: string;
    }
    interface ICreateCountry {
        code: string;
        name?: string;
        tax?: number;
        tax_name?: string;
    }
    interface IUpdateCountry {
        code?: string;
        name?: string;
        tax?: number;
        tax_name?: string;
    }
    interface ICurrencyExchangeAdjustment {
        id: number;
        adjustment: string;
        original_amount: string;
        final_amount: string;
        currency: string;
    }
    interface ICurrency {
        currency: string;
        rate_updated_at: string;
        enabled: boolean;
    }
    type CustomerCollectionSortOrder = "alpha-asc" | "alpha-desc" | "best-selling" | "created" | "created-desc" | "manual" | "price-asc" | "price-desc";
    interface ICustomCollection {
        body_html: string | null;
        handle: string;
        image: IImage;
        id: number;
        metafield?: IObjectMetafield;
        published?: string;
        published_at: string;
        published_scope: string;
        sort_order: CustomerCollectionSortOrder;
        template_suffix: string | null;
        title: string;
        updated_at: string;
    }
    type CustomerState = "declined" | "disabled" | "enabled" | "invited";
    interface ICustomer {
        accepts_marketing: boolean;
        addresses?: ICustomerAddress[];
        created_at: string;
        currency: string;
        default_address: ICustomerAddress;
        email: string;
        first_name: string;
        id: number;
        last_name: string;
        metafield?: IObjectMetafield;
        phone: string;
        multipass_identifier: null;
        last_order_id: number | null;
        last_order_name: string | null;
        note: string | null;
        orders_count: number;
        state: CustomerState;
        tags: string;
        tax_exempt: boolean;
        total_spent: string;
        updated_at: string;
        verified_email: boolean;
    }
    interface ICustomerAddress {
        address1: string;
        address2?: string;
        city: string;
        company: string | null;
        country: string;
        country_code: string;
        country_name: string;
        customer_id: number;
        default: boolean;
        first_name: string;
        id: number;
        last_name: string;
        latitude: number | null;
        longitude: number | null;
        name: string;
        phone: string | null;
        province: string | null;
        province_code: string | null;
        zip: string;
    }
    interface ICustomerSavedSearch {
        created_at: string;
        id: number;
        name: string;
        query: string;
        updated_at: string;
    }
    interface ICustomerSendInvite {
        to: string;
        from: string;
        bcc: string[];
        subject: string;
        custom_message: string;
    }
    interface IDeprecatedApiCall {
        api_type: string;
        description: string;
        documentation_url: string;
        endpoint: string;
        graphql_schema_name: string | null;
        last_call_at: string;
        migration_deadline: string;
        version: string;
    }
    type AllocationMethod = "across" | "each" | "one";
    type TargetSelection = "all" | "entitled" | "explicit";
    type TargetType = "line_item" | "shipping_line";
    type DiscountApplicationType = "manual" | "script" | "discount_code";
    type ValueType = "fixed_amount" | "percentage";
    interface IDiscountApplication {
        allocation_method: AllocationMethod;
        code: string;
        description: string;
        target_selection: TargetSelection;
        target_type: TargetType;
        title: string;
        type: DiscountApplicationType;
        value: string;
        value_type: ValueType;
    }
    interface IDiscountCode {
        created_at: string;
        id: number;
        code: string;
        price_rule_id: number;
        updated_at: string;
        usage_count: number;
    }
    interface IDiscountCodeCreation {
        codes_count: number;
        completed_at: string;
        created_at: string;
        failed_count: number;
        id: number;
        imported_count: number;
        price_rule_id: number;
        started_at: string;
        status: string;
        updated_at: string;
    }
    type DisputeReason = "bank_not_process" | "credit_not_processed" | "customer_initiated" | "debit_not_authorized" | "duplicate" | "fraudulent" | "general" | "incorrect_account_details" | "insufficient_funds" | "product_not_received" | "product_unacceptable" | "subscription_cancelled" | "unrecognized" | "credit_not_processed";
    type DisputeStatus = "needs_response" | "under_review" | "charge_refunded" | "accepted" | "won" | "lost";
    interface IDispute {
        id: number;
        order_id: number;
        type: "inquiry" | "chargeback";
        currency: string;
        amount: string;
        reason: DisputeReason;
        network_reason_code: number;
        status: DisputeStatus;
        evidence_due_by: string;
        evidence_sent_on: string;
        finalized_on: string;
    }
    interface IDisputeEvidenceAddress {
        address1: string;
        address2: string;
        city: string;
        country: string;
        country_code: string;
        id: number;
        province: string;
        province_code: string;
        zip: string;
    }
    interface IDisputeEvidenceFulfillment {
        shipping_carrier: number;
        shipping_date: string;
        shipping_tracking_number: string;
    }
    interface IDisputeEvidenceFiles {
        cancellation_policy_file_id: number | null;
        customer_communication_file_id: number | null;
        customer_signature_file_id: number | null;
        refund_policy_file_id: number | null;
        service_documentation_file_id: number | null;
        shipping_documentation_file_id: number | null;
        uncategorized_file_id: number | null;
    }
    interface IDisputeEvidence {
        access_activity_log: string | null;
        billing_address: IDisputeEvidenceAddress;
        cancellation_policy_disclosure: string | null;
        cancellation_rebuttal: string | null;
        created_at: string;
        customer_email_address: string;
        customer_first_name: string;
        customer_last_name: string;
        dispute_evidence_files: IDisputeEvidenceFiles;
        fulfillments: IDisputeEvidenceFulfillment[];
        id: number;
        payments_dispute_id: number;
        product_description: string;
        refund_policy_disclosure: string | null;
        refund_refusal_explanation: string | null;
        shipping_address: IDisputeEvidenceAddress;
        submitted_by_merchant_on: string | null;
        uncategorized_text: string;
        updated_at: string;
    }
    interface IUpdateDisputeEvidence {
        refund_refusal_explanation: string;
    }
    type DisputeFileUploadDisputeEvidenceType = "cancellation_policy_file" | "customer_communication_file" | "customer_signature_file" | "refund_policy_file" | "service_documentation_file" | "shipping_documentation_file" | "uncategorized_file";
    interface IDisputeFileUpload {
        created_at: string;
        dispute_evidence_id: number;
        dispute_evidence_type: DisputeFileUploadDisputeEvidenceType;
        file_size: number;
        file_type: string;
        filename: string;
        id: number;
        original_filename: string;
        shop_id: number;
        updated_at: string;
        url: string;
    }
    interface ICreateDisputeFileUpload {
        document_type: DisputeFileUploadDisputeEvidenceType;
        filename: string;
        mimetype: string;
        data: string;
    }
    interface IDraftOrderNoteAttribute {
        name: string;
        value: string;
    }
    type DraftOrderDiscountValueType = "fixed_amount" | "percentage";
    interface IDraftOrderDiscount {
        amount: string;
        description: string;
        non_applicable_reason: string;
        title: string;
        value: string;
        value_type: DraftOrderDiscountValueType;
    }
    type DraftOrderLineItemFulfullmentService = "api" | "custom" | "legacy" | "manual";
    type DraftOrderLineItemFulfullmentStatus = "fulfilled" | "partial";
    interface IDraftOrderLineItem {
        applied_discount: IDraftOrderDiscount | null;
        discount_codes: any[];
        fulfillment_service: DraftOrderLineItemFulfullmentService;
        fulfillment_status?: DraftOrderLineItemFulfullmentStatus | null;
        gift_card: boolean;
        grams: number;
        key: string;
        id: number;
        line_price: string;
        name: string;
        origin_location_id: number;
        price: string;
        product_id: number;
        properties: any | null;
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        tax_lines: ICheckoutTaxLine[];
        title: string;
        variant_id: number;
        variant_title: string;
        vendor: string;
    }
    interface IDraftOrder {
        applied_discount: IDraftOrderDiscount | null;
        billing_address: ICustomerAddress;
        completed_at: string | null;
        created_at: string;
        currency: string;
        customer: ICustomer | null;
        email: string;
        id: number;
        invoice_sent_at: string | null;
        invoice_url: string;
        line_items: IDraftOrderLineItem[];
        name: string;
        note: string;
        note_attributes: IDraftOrderNoteAttribute[];
        order_id: number | null;
        shipping_address: ICustomerAddress;
        shipping_line: string;
        status: string;
        subtotal_price: string;
        tags: string;
        tax_exempt: boolean;
        tax_lines: string;
        taxes_included: boolean;
        total_tax: string;
        total_price: string;
        updated_at: string;
    }
    interface IEvent {
        arguments: any[];
        author: string;
        body: string | null;
        created_at: string;
        id: number;
        description: string;
        path: string;
        message: string;
        subject_id: number;
        subject_type: "Article" | "Blog" | "Collection" | "Comment" | "Order" | "Page" | "Product" | "ApiPermission";
        verb: string;
    }
    type IFulfillmentStatus = "cancelled" | "error" | "failure" | "open" | "pending" | "success";
    interface IFulfillmentReceipt {
        textcase: boolean;
        authorization: string;
    }
    interface IFulfillmentLineItemProperty {
        name: string;
        value: string;
    }
    interface IFulfillmentLineItemTaxLine {
        title: string;
        price: string;
        rate: number;
    }
    interface IFulfillmentLineItem {
        id: number;
        variant_id: number;
        title: string;
        quantity: number;
        price: string;
        grams: number;
        sku: string;
        variant_title: string;
        vendor: any | null;
        fulfillment_service: string;
        product_id: number;
        requires_shipping: boolean;
        taxable: boolean;
        gift_card: boolean;
        name: string;
        variant_inventory_management: string;
        properties: IFulfillmentLineItemProperty[];
        product_exists: boolean;
        fulfillable_quantity: number;
        total_discount: string;
        fulfillment_status: IFulfillmentStatus;
        tax_lines: IFulfillmentLineItemTaxLine[];
    }
    interface IFulfillment {
        created_at: string;
        id: number;
        line_items: IFulfillmentLineItem[];
        notify_customer: boolean;
        order_id: number;
        receipt: IFulfillmentReceipt;
        service: string;
        shipment_status: string | null;
        status: IFulfillmentStatus;
        tracking_company: string;
        tracking_numbers: string[];
        tracking_url: string;
        tracking_urls: string[];
        updated_at: string;
        variant_inventory_management: string;
    }
    type FulfillmentEventStatus = "attempted_delivery" | "confirmed" | "delivered" | "failure" | "in_transit" | "label_printed" | "label_purchased" | "out_for_delivery" | "picked_up" | "ready_for_pickup";
    interface IFulfillmentEvent {
        address1: string | null;
        city: string | null;
        country: string | null;
        created_at: string;
        estimated_delivery_at: string | null;
        fulfillment_id: number;
        id: number;
        happened_at: string;
        latitude: string | null;
        longitude: string;
        message: string | null;
        order_id: number;
        province: string | null;
        shop_id: number;
        status: FulfillmentEventStatus;
        updated_at: string;
        zip: string | null;
    }
    interface IFulfillmentOrderDestination {
        address1: string;
        address2: string;
        city: string;
        company: string;
        country: string;
        email: string;
        first_name: string;
        id: number;
        last_name: string;
        phone: string;
        province: string;
        zip: string;
    }
    interface IFulfillmentOrderLineItem {
        id: number;
        shop_id: number;
        fulfillment_order_id: number;
        line_item_id: number;
        inventory_item_id: number;
        quantity: number;
        fulfillable_quantity: number;
        variant_id: number;
    }
    type FulfillmentOrderRequestStatus = "accepted" | "cancellation_accepted" | "cancellation_rejected" | "cancellation_requested" | "closed" | "rejected" | "submitted" | "unsubmitted";
    type FulfillmentOrderStatus = "cancelled" | "closed" | "in_progress" | "incomplete" | "open";
    type FulfillmentOrderSupportedAction = "cancel_fulfillment_order" | "create_fulfillment" | "move" | "request_cancellation" | "request_fulfillment";
    interface IFulfillmentOrderMerchantRequestRequestOptions {
        date: string;
        note: string;
        shipping_method: string;
    }
    interface IFulfillmentOrderMerchantRequest {
        kind: string;
        message: string;
        request_options: IFulfillmentOrderMerchantRequestRequestOptions;
    }
    interface IFulfillmentOrderAssignedLocation {
        address1: string;
        address2: string;
        city: string;
        country_code: string;
        location_id: number;
        name: string;
        phone: string;
        province: string;
        zip: string;
    }
    interface IFulfillmentOrderFulfillmentHolds {
        reason: string;
        reason_notes: string;
    }
    interface IFulfillmentOrderInternationalDuties {
        incoterm: "DAP" | "DDP";
    }
    interface IFulfillmentOrderDeliveryMethod {
        id: number;
        method_type: "local" | "none" | "pick_up" | "retail" | "shipping";
        min_delivery_date_time: string;
        max_delivery_date_time: string;
    }
    interface IFulfillmentOrder {
        assigned_location: IFulfillmentOrderAssignedLocation;
        assigned_location_id: number;
        destination: IFulfillmentOrderDestination;
        id: number;
        line_items: IFulfillmentOrderLineItem[];
        merchant_requests: IFulfillmentOrderMerchantRequest[];
        order_id: number;
        fulfillment_service_handle: string;
        request_status: FulfillmentOrderRequestStatus;
        shop_id: number;
        status: FulfillmentOrderStatus;
        supported_actions: FulfillmentOrderSupportedAction[];
        fulfillment_holds: IFulfillmentOrderFulfillmentHolds[];
        international_duties: IFulfillmentOrderInternationalDuties;
        delivery_method: IFulfillmentOrderDeliveryMethod | null;
    }
    interface ILocationForMoveLocation {
        id: number;
        name: string;
    }
    interface ILocationForMove {
        location: ILocationForMoveLocation;
        movable: boolean;
        message: string;
    }
    interface ISetFulfillmentOrdersDeadline {
        fulfillment_deadline: string;
        fulfillment_order_ids: number[];
    }
    interface ICreateFulfillmentRequestFulfillmentOrderLineItem {
        id: number;
        quantity: number;
    }
    interface ICreateFulfillmentRequest {
        message?: string;
        fulfillment_order_line_items?: ICreateFulfillmentRequestFulfillmentOrderLineItem[];
    }
    interface IFulfillmentService {
        callback_url: string;
        email: string | null;
        format: "json";
        handle: string;
        id: number;
        include_pending_stock: boolean;
        inventory_management: boolean;
        location_id: number;
        name: string;
        provider_id: number | null;
        requires_shipping_method: boolean;
        service_name: string | null;
        tracking_support: boolean;
    }
    interface IGiftCard {
        id: number;
        api_client_id: number;
        user_id: number;
        order_id: number;
        customer_id: number;
        line_item_id: number;
        balance: string;
        currency: string;
        code: string;
        last_characters: string;
        note: string;
        template_suffix: string;
        created_at: string;
        updated_at: string;
        disabled_at: string;
        expires_on: string;
        initial_value: string;
    }
    interface IGiftCardAdjustment {
        id: number;
        number: number;
        amount: number;
        note: string;
        remote_transaction_ref: string;
        remote_transaction_url: string;
        api_client_id: number;
        user_id: number;
        order_transaction_id: number;
        created_at: string;
        processed_at: string;
    }
    interface IInventoryItemCountryHarmonizedSystemCode {
        harmonized_system_code: string;
        country_code: string;
    }
    interface IInventoryItem {
        id: number;
        sku: string;
        tracked: boolean;
        created_at: string;
        updated_at: string;
        requires_shipping: boolean;
        cost: string | null;
        country_code_of_origin: string | null;
        province_code_of_origin: string | null;
        harmonized_system_code: string | null;
        country_harmonized_system_codes: IInventoryItemCountryHarmonizedSystemCode[];
    }
    interface IInventoryLevel {
        inventory_item_id: number;
        location_id: number;
        available: number | null;
        updated_at: string;
    }
    type LineItemFulfillmentStatus = "fulfilled" | "not_eligible" | "partial" | null;
    interface ILineItemProperty {
        name: string;
        value: string;
    }
    interface ILineItemDiscountAllocation {
        amount: string;
        discount_application_index: number;
        amount_set: IMoneySet;
    }
    interface ILineItemTaxLine {
        title: string;
        price: string;
        rate: number;
        price_set: IMoneySet;
    }
    interface ILocation {
        id: number;
        active: boolean;
        admin_graphql_api_id: string;
        address1: string;
        address2: string | null;
        city: string;
        country: string;
        country_code: string;
        country_name: string;
        created_at: string;
        deleted_at: string;
        legacy: boolean;
        name: string;
        phone: string;
        province: string;
        province_code: string;
        updated_at: string;
        zip: string;
    }
    interface IMarketingEventMarketedResources {
        id: number;
        type: "product" | "collection" | "price_rule" | "discount" | "page" | "article" | "shop";
    }
    type MarketingEventEventType = "ad" | "post" | "message" | "retargeting" | "sem" | "transactional" | "affiliate" | "loyalty" | "newsletter" | "abandoned_cart" | "receipt";
    type MarketingEventMarketingChannel = "search" | "display" | "social" | "email" | "referral";
    type MarketingEventBudgetType = "daily" | "lifetime";
    interface IMarketingEvent {
        breadcrumb_id: any | null;
        budget: string;
        budget_type: MarketingEventBudgetType;
        currency: string;
        description: string | null;
        ended_at: string | null;
        event_target: string;
        event_type: MarketingEventEventType;
        id: number;
        manage_url: string;
        marketed_resources: IMarketingEventMarketedResources[];
        marketing_channel: MarketingEventMarketingChannel;
        paid: boolean;
        preview_url: string;
        referring_domain: string;
        remote_id: string;
        scheduled_to_end_at: string | null;
        started_at: string;
        utm_campaign: string;
        utm_medium: string;
        utm_source: string;
    }
    type MetaFieldType = "boolean" | "color" | "date" | "date_time" | "dimension" | "file_reference" | "json" | "multi_line_text_field" | "number_decimal" | "number_integer" | "page_reference" | "product_reference" | "rating" | "single_line_text_field" | "url" | "variant_reference" | "volume" | "weight";
    interface IMetafield {
        created_at: string;
        description: string | null;
        id: number;
        key: string;
        namespace: string;
        owner_id: number;
        owner_resource: string;
        type?: MetaFieldType;
        updated_at: string;
        value: string | number;
        value_type?: "string" | "integer" | "json_string";
    }
    type OrderCancelReason = "customer" | "declined" | "fraud" | "inventory" | "other";
    interface IOrderClientDetails {
        accept_language: string | null;
        browser_height: number | null;
        browser_ip: string | null;
        browser_width: number | null;
        session_hash: string | null;
        user_agent: string | null;
    }
    interface IOrderCustomer {
        accepts_marketing: boolean;
        created_at: string;
        default_address: ICustomerAddress;
        email: string;
        first_name: string;
        id: number;
        last_name: string;
        phone: string;
        multipass_identifier: null;
        last_order_id: number | null;
        last_order_name: string | null;
        note: string | null;
        orders_count: number;
        state: CustomerState;
        tags: string;
        total_spent: string;
        updated_at: string;
    }
    type OrderDiscountCodeType = "fixed_amount" | "percentage" | "shipping";
    type OrderFinancialStatus = "authorized" | "paid" | "partially_paid" | "partially_refunded" | "pending" | "refunded" | "voided";
    type OrderFulfillmentStatus = "fulfilled" | "partial" | "restocked" | null;
    type OrderProcessingMethod = "checkout" | "direct" | "express" | "manual" | "offsite";
    interface IOrderDiscountCode {
        amount: string;
        code: string;
        type: OrderDiscountCodeType;
    }
    interface IOrderFulfillmentLineItemTaxLine {
        title: string;
        price: string;
        rate: number;
    }
    interface IOrderFulfillmentLineItemProperty {
        name: string;
        value: string;
    }
    interface IOrderFulfillmentLineItem {
        id: number;
        variant_id: number;
        title: string;
        quantity: number;
        price: string;
        grams: number;
        sku: string;
        variant_title: string;
        vendor: string | null;
        fulfillment_service: string;
        product_id: number;
        requires_shipping: boolean;
        taxable: boolean;
        gift_card: boolean;
        name: string;
        variant_inventory_management: string;
        product_exists: boolean;
        fulfillable_quantity: number;
        total_discount: string;
        fulfillment_status: "fulfilled" | "partial" | null;
        tax_lines: IOrderFulfillmentLineItemTaxLine[];
        properties: IOrderFulfillmentLineItemProperty[];
    }
    interface IOrderFulfillment {
        created_at: string;
        id: number;
        location_id: number | null;
        line_items: IOrderFulfillmentLineItem[];
        notify_customer: boolean;
        order_id: number;
        receipt: IFulfillmentReceipt;
        service: string;
        shipment_status: FulfillmentEventStatus;
        status: IFulfillmentStatus;
        tracking_company: string;
        tracking_number: string;
        tracking_numbers: string[];
        tracking_url: string;
        tracking_urls: string[];
        updated_at: string;
        variant_inventory_management: string;
    }
    interface IOrderLineItemProperty {
        name: string;
        value: string;
    }
    interface IOrderTaxLine {
        title: string;
        price: string;
        rate: number;
    }
    interface IOrderLineItemNote {
        name: string;
        value: string;
    }
    interface IOrderLineItem {
        discount_allocations: ILineItemDiscountAllocation[];
        fulfillable_quantity: number;
        fulfillment_service: string;
        fulfillment_status: LineItemFulfillmentStatus;
        grams: number;
        id: number;
        pre_tax_price?: string;
        pre_tax_price_set?: IMoneySet;
        price: string;
        price_set: IMoneySet;
        product_id: number | null;
        quantity: number;
        requires_shipping: boolean;
        sku: string;
        title: string;
        variant_id: number | null;
        variant_title: string;
        vendor: string;
        name: string;
        gift_card: boolean;
        properties: IOrderLineItemProperty[];
        taxable: boolean;
        tax_lines: ILineItemTaxLine[];
        tip_payment_gateway?: string;
        tip_payment_method?: string;
        total_discount: string;
        total_discount_set: IMoneySet;
    }
    interface IOrderShippingLineTaxLine {
        title: string;
        price: string;
        rate: number;
    }
    interface IOrderShippingLine {
        id: number;
        code: string;
        discounted_price: string;
        discounted_price_set: IMoneySet;
        price: string;
        price_set: IMoneySet;
        source: string;
        title: string;
        tax_lines: IOrderShippingLineTaxLine[];
        carrier_identifier: string | null;
        requested_fulfillment_service_id: string | null;
    }
    interface IPaymentDetails {
        avs_result_code: string | null;
        credit_card_bin: string | null;
        credit_card_company: string;
        credit_card_number: string;
        cvv_result_code: string | null;
    }
    interface IOrder {
        app_id: number;
        billing_address: ICustomerAddress;
        browser_ip: string | null;
        buyer_accepts_marketing: boolean;
        cancel_reason: OrderCancelReason;
        cancelled_at: string | null;
        cart_token: string;
        client_details: IOrderClientDetails;
        closed_at: string | null;
        confirmed: boolean;
        created_at: string;
        currency: string;
        current_subtotal_price: string;
        current_subtotal_price_set: IMoneySet;
        current_total_discounts: string;
        current_total_discounts_set: IMoneySet;
        current_total_duties_set: null | IMoneySet;
        current_total_price: string;
        current_total_price_set: IMoneySet;
        current_total_tax: string;
        current_total_tax_set: IMoneySet;
        customer?: IOrderCustomer;
        customer_locale: string;
        discount_applications: IDiscountApplication[];
        discount_codes: IOrderDiscountCode[];
        email: string;
        financial_status: OrderFinancialStatus;
        fulfillments: IOrderFulfillment[];
        fulfillment_status: OrderFulfillmentStatus;
        gateway: string;
        id: number;
        landing_site: string;
        line_items: IOrderLineItem[];
        location_id: number | null;
        name: string;
        note: string | null;
        note_attributes: IOrderLineItemNote[];
        number: number;
        order_number: number;
        order_status_url: string;
        payment_details?: IPaymentDetails;
        payment_gateway_names: string[];
        phone: string;
        presentment_currency: string;
        processed_at: string;
        checkout_id: number;
        processing_method: OrderProcessingMethod;
        referring_site: string;
        refunds: IRefund[];
        shipping_address: ICustomerAddress;
        shipping_lines: IOrderShippingLine[];
        source_identifier: string | null;
        source_name: "web" | "pos" | "shopify_draft_order" | "iphone" | "android" | string;
        subtotal_price: string;
        subtotal_price_set: IMoneySet;
        tags: string;
        tax_lines: IOrderTaxLine[];
        taxes_included: boolean;
        test: boolean;
        token: string;
        total_discounts: string;
        total_discounts_set: IMoneySet;
        total_line_items_price: string;
        total_line_items_price_set: IMoneySet;
        total_price: string;
        total_price_set: IMoneySet;
        total_shipping_price_set: IMoneySet;
        total_tax: string;
        total_tax_set: IMoneySet;
        total_tip_received: string;
        total_weight: number;
        updated_at: string;
        user_id: number | null;
    }
    interface IPaginatedResult<T> extends Array<T> {
        nextPageParameters?: any;
        previousPageParameters?: any;
    }
    type OrderRisksRecommendation = "accept" | "investigate" | "cancel";
    interface IOrderRisk {
        cause_cancel: boolean;
        checkout_id: number | null;
        display: boolean;
        id: number;
        order_id: number;
        merchant_message: string;
        message: string;
        recommendation: OrderRisksRecommendation;
        score: number;
        source: string;
    }
    interface IPage {
        author: string;
        body_html: string;
        created_at: string;
        handle: string;
        id: number;
        metafield: IObjectMetafield[];
        published_at: string;
        shop_id: number;
        template_suffix: string | null;
        title: string;
        updated_at: string;
    }
    interface IPayout {
        id: number;
        status: "scheduled" | "in_transit" | "paid" | "failed" | "canceled";
        date: string;
        currency: string;
        amount: string;
        summary: {
            adjustments_fee_amount: string;
            adjustments_gross_amount: string;
            charges_fee_amount: string;
            charges_gross_amount: string;
            refunds_fee_amount: string;
            refunds_gross_amount: string;
            reserved_funds_fee_amount: string;
            reserved_funds_gross_amount: string;
            retried_payouts_fee_amount: string;
            retried_payouts_gross_amount: string;
        };
    }
    interface IPolicy {
        title: string;
        body: string;
        url: string;
        created_at: string;
        updated_at: string;
    }
    interface IPriceRulePrerequisiteSubtotalRange {
        greater_than_or_equal_to: string;
    }
    interface IPriceRulePrerequisiteQuantityRange {
        greater_than_or_equal_to: string;
    }
    interface IPriceRulePrerequisiteToEntitlementQuantityRange {
        prerequisite_quantity: number | null;
        entitled_quantity: number | null;
    }
    interface IPriceRulePrerequisiteShippingPriceRange {
        less_than_or_equal_to: string;
    }
    type PriceRuleTargetType = "line_item" | "shipping_line";
    type PriceRuleTargetSelection = "all" | "entitled";
    type PriceRuleAllocationMethod = "each" | "across";
    type PriceRuleValueType = "fixed_amount" | "percentage";
    type PriceRuleCustomerSelection = "all" | "prerequisite";
    interface IPriceRule {
        id: number;
        title: string;
        target_type: PriceRuleTargetType;
        target_selection: PriceRuleTargetSelection;
        allocation_method: PriceRuleAllocationMethod;
        value_type: PriceRuleValueType;
        value: string;
        once_per_customer: boolean;
        usage_limit: number | null;
        allocation_limit: number | null;
        customer_selection: PriceRuleCustomerSelection;
        prerequisite_saved_search_ids: number[];
        prerequisite_subtotal_range: IPriceRulePrerequisiteSubtotalRange | null;
        prerequisite_shipping_price_range: IPriceRulePrerequisiteShippingPriceRange | null;
        prerequisite_quantity_range: IPriceRulePrerequisiteQuantityRange | null;
        prerequisite_to_entitlement_quantity_ratio: IPriceRulePrerequisiteToEntitlementQuantityRange | null;
        prerequisite_product_ids: number[];
        prerequisite_variant_ids: number[];
        prerequisite_collection_ids: number[];
        prerequisite_customer_ids: number[];
        entitled_product_ids: number[];
        entitled_variant_ids: number[];
        entitled_collection_ids: number[];
        entitled_country_ids: number[];
        created_at: string;
        updated_at: string;
        starts_at: string;
        ends_at: string;
        admin_graphql_api_id: string;
    }
    interface IProductOption {
        id: number;
        name: string;
        position: number;
        product_id: number;
        values: string[];
    }
    interface IProduct {
        body_html: string;
        created_at: string;
        handle: string;
        id: number;
        image: IProductImage;
        images: IProductImage[];
        options: IProductOption[];
        product_type: string;
        published_at: string;
        published_scope: string;
        tags: string;
        template_suffix: string | null;
        title: string;
        metafields_global_title_tag?: string;
        metafields_global_description_tag?: string;
        updated_at: string;
        variants: IProductVariant[];
        vendor: string;
        status: "active" | "archived" | "draft";
    }
    interface IProductImage {
        created_at: string;
        id: number;
        position: number;
        product_id: number;
        variant_ids: number[];
        src: string;
        width: number;
        height: number;
        updated_at: string;
        alt: string | null;
    }
    type ProductVariantInventoryPolicy = "deny" | "continue";
    type ProductVariantWeightUnit = "g" | "kg" | "oz" | "lb";
    interface IProductVariant {
        barcode: string;
        compare_at_price: string | null;
        created_at: string;
        fulfillment_service: string;
        grams: number;
        id: number;
        image_id: number | null;
        inventory_item_id: number;
        inventory_management: string;
        inventory_policy: ProductVariantInventoryPolicy;
        inventory_quantity: number;
        old_inventory_quantity: number;
        option1: string | null;
        option2: string | null;
        option3: string | null;
        presentment_prices: IProductVariantPresentmentPriceSet[];
        position: number;
        price: string;
        product_id: number;
        requires_shipping: boolean;
        sku: string;
        taxable: boolean;
        tax_code: string | null;
        title: string;
        updated_at: string;
        weight: number;
        weight_unit: ProductVariantWeightUnit;
    }
    interface IProductVariantOption {
        option_id: number;
        name: string;
        value: string;
    }
    interface IProductVariantPresentmentPriceSet {
        price: IMoney;
        compare_at_price: IMoney;
    }
    interface IProductListingVariant extends IProductVariant {
        available: boolean;
        option_values: IProductVariantOption[];
    }
    interface IProductListing {
        product_id: number;
        body_html: string;
        created_at: string;
        handle: string;
        images: IProductImage[];
        options: IProductOption[];
        product_type: string;
        published_at: string;
        tags: string;
        title: string;
        updated_at: string;
        variants: IProductListingVariant[];
    }
    interface IProvince {
        code: string;
        country_id: number;
        id: number;
        name: string;
        shipping_zone_id: NumberConstructor;
        tax: number;
        tax_name: string;
        tax_type: string | null;
        tax_percentage: number;
    }
    type RecurringApplicationChargeStatus = "accepted" | "active" | "cancelled" | "declined" | "expired" | "frozen" | "pending";
    interface IRecurringApplicationCharge {
        activated_on: string | null;
        billing_on: string | null;
        cancelled_on: string | null;
        capped_amount: number;
        confirmation_url: string;
        created_at: string;
        id: number;
        name: string;
        price: string;
        return_url: string;
        status: RecurringApplicationChargeStatus;
        terms: string;
        test: boolean | null;
        trial_days: number;
        trial_ends_on: string;
        updated_at: string;
    }
    interface ICreateRecurringApplicationCharge {
        capped_amount?: number;
        name: string;
        price: number;
        return_url: string;
        terms?: string;
        test?: boolean | null;
        trial_days?: number;
        trial_ends_on?: string;
    }
    interface IRedirect {
        id: string;
        path: string;
        target: string;
    }
    interface ICreateRedirect {
        path: string;
        target: string;
    }
    interface IUpdateRedirect {
        path?: string;
        target?: string;
    }
    interface IRefundLineItem {
        id: number;
        line_item: IOrderLineItem;
        line_item_id: number;
        quantity: number;
        restock_type: "no_restock" | "cancel" | "return" | "legacy_restock";
        location_id: number;
        subtotal: string;
        total_tax: string;
        subtotal_set: IMoneySet;
        total_tax_set: IMoneySet;
    }
    interface IMoney {
        amount: number | string;
        currency_code: string;
    }
    interface IMoneySet {
        shop_money: IMoney;
        presentment_money: IMoney;
    }
    interface IOrderAdjustment {
        id: number;
        order_id: number;
        refund_id: number;
        amount: string;
        tax_amount: string;
        kind: string;
        reason: string;
        amount_set: IMoneySet;
        tax_amount_set: IMoneySet;
    }
    interface IRefund {
        created_at: string;
        id: number;
        note: string;
        order_adjustments: IOrderAdjustment[];
        order_id: number;
        processed_at: string;
        refund_line_items: IRefundLineItem[];
        restock: string;
        transactions: ITransaction[];
        user_id: string;
    }
    interface IReport {
        category: string;
        id: number;
        name: string;
        shopify_ql: string;
        updated_at: string;
    }
    type ResourceFeedbackState = "requires_action" | "success";
    interface IResourceFeedback {
        shop_id: number;
        created_at: string;
        updated_at: string;
        resource_id: number;
        resource_type: string;
        state: ResourceFeedbackState;
        messages: string[];
        feedback_generated_at: string;
    }
    type ScriptTagDisplayScope = "online_store" | "order_status" | "all";
    type ScriptTagEvent = "onload";
    interface IScriptTag {
        created_at: string;
        event: ScriptTagEvent;
        id: number;
        src: string;
        display_scope: ScriptTagDisplayScope;
        cache: boolean;
        updated_at: string;
    }
    interface ICreateScriptTag {
        event: ScriptTagEvent;
        src: string;
        display_scope?: ScriptTagDisplayScope;
        cache?: boolean;
    }
    interface IUpdateScriptTag {
        event: ScriptTagEvent;
        src: string;
        display_scope?: ScriptTagDisplayScope;
        cache?: boolean;
    }
    interface ICarrierShippingRateProvider {
        carrier_service_id: number;
        flat_rate_modified: string;
        id: number;
        percentage_modified: number;
        service_filter: any;
        shipping_zone_id: number;
    }
    interface IPriceBasedShippingRate {
        id: number;
        max_order_subtotal: string | null;
        min_order_subtotal: string | null;
        name: string;
        price: string;
        shipping_zone_id: number;
    }
    interface IWeightBasedShippingRate {
        id: number;
        name: string;
        price: string;
        shipping_zone_id: number;
        weight_high: number;
        weight_low: number;
    }
    interface IShippingZoneCountry {
        code: string;
        country_id: number;
        id: number;
        name: string;
        tax: number;
        tax_name: string;
        tax_percentage: number;
        tax_type: any | null;
        shipping_zone_id: number;
        provinces: IProvince[];
    }
    interface IShippingZone {
        id: number;
        name: string;
        countries: IShippingZoneCountry[];
        carrier_shipping_rate_providers: ICarrierShippingRateProvider[];
        price_based_shipping_rates: IPriceBasedShippingRate[];
        weight_based_shipping_rates: IWeightBasedShippingRate[];
    }
    interface IShop {
        address1: string;
        address2: string;
        checkout_api_supported: boolean;
        city: string;
        cookie_consent_level: string;
        country: string;
        country_code: string;
        country_name: string;
        county_taxes: true | null;
        created_at: string;
        currency: string;
        customer_email: string;
        domain: string;
        eligible_for_card_reader_giveaway: boolean;
        eligible_for_payments: boolean;
        email: string;
        enabled_presentment_currencies: string[];
        finances: boolean;
        force_ssl?: boolean;
        google_apps_domain: string | null;
        google_apps_login_enabled: true | null;
        has_discounts: boolean;
        has_gift_cards: boolean;
        has_storefront: boolean;
        iana_timezone: string;
        id: number;
        latitude: number;
        longitude: number;
        money_format: string;
        money_in_emails_format: string;
        money_with_currency_format: string;
        money_with_currency_in_emails_format: string;
        myshopify_domain: string;
        name: string;
        password_enabled: boolean;
        phone: string | null;
        plan_display_name: string;
        plan_name: string;
        pre_launch_enabled: boolean;
        primary_locale: string;
        primary_location_id: number;
        province: string;
        province_code: string;
        requires_extra_payments_agreement: boolean;
        setup_required: boolean;
        shop_owner: string;
        source: string | null;
        tax_shipping: boolean | null;
        taxes_included: true | null;
        timezone: string;
        transactional_sms_disabled: boolean;
        updated_at: string;
        weight_unit: string;
        zip: string;
    }
    type SmartCollectionRuleTextColumn = "title" | "tag" | "type" | "variant_title" | "vendor";
    type SmartCollectionRuleTextRelation = "contains" | "equals" | "ends_with" | "not_contains" | "not_equals" | "starts_with";
    type SmartCollectionRuleNumberColumn = "variant_compare_at_price" | "variant_inventory" | "variant_price" | "variant_weight";
    type TSmartCollectionRuleNumberRelation = "equals" | "greater_than" | "less_than" | "not_equals";
    interface ISmartCollectionRule {
        column: SmartCollectionRuleTextColumn | SmartCollectionRuleNumberColumn;
        relation: SmartCollectionRuleTextRelation | TSmartCollectionRuleNumberRelation;
        condition: string;
    }
    type SmartCollectionSortOrder = "alpha-asc" | "alpha-desc" | "best-selling" | "created" | "created-desc" | "manual" | "price-asc" | "price-desc";
    interface ISmartCollection {
        body_html: string;
        disjunctive: boolean;
        handle: string;
        id: number;
        image?: IImage;
        published_at: string;
        published_scope: string;
        rules: ISmartCollectionRule[];
        sort_order: SmartCollectionSortOrder;
        template_suffix: string | null;
        title: string;
        updated_at: string;
    }
    interface IStorefrontAccessToken {
        id: string;
        access_token: string;
        access_scope: string;
        created_at: string;
        title: string;
    }
    type ThemeRole = "main" | "unpublished";
    interface ITheme {
        created_at: string;
        id: number;
        name: string;
        previewable: boolean;
        processing: boolean;
        role: ThemeRole;
        theme_store_id: number;
        updated_at: string;
    }
    type TenderTransactionPaymentMethod = "credit_card" | "cash" | "android_pay" | "apple_pay" | "google_pay" | "samsung_pay" | "shopify_pay" | "amazon" | "klarna" | "paypal" | "unknown" | "other";
    interface ITenderTransactionPaymentDetails {
        credit_card_number: string;
        credit_card_company: string;
    }
    interface ITenderTransaction {
        id: number;
        order_id: number;
        amount: string;
        currency: string;
        user_id: number;
        test: boolean;
        processed_at: string;
        remote_reference: string;
        payment_details: ITenderTransactionPaymentDetails;
        payment_method: TenderTransactionPaymentMethod;
    }
    type TransactionErrorCode = "call_issuer" | "card_declined" | "expired_card" | "incorrect_address" | "incorrect_cvc" | "incorrect_number" | "incorrect_zip" | "invalid_cvc" | "invalid_expiry_date" | "invalid_number" | "pick_up_card" | "processing_error";
    type TransactionKind = "authorization" | "capture" | "refund" | "sale" | "void";
    type TransactionStatus = "error" | "failure" | "pending" | "success";
    interface IExtendedAuthorizationAttributes {
        standard_authorization_expires_at: string;
        extended_authorization_expires_at: string;
    }
    interface IPaymentsRefund {
        status: TransactionStatus;
        acquirer_reference_number: string;
    }
    interface ITransaction {
        amount: string;
        authorization: string | null;
        authorization_expires_at?: string | null;
        created_at: string;
        currency: string;
        currency_exchange_adjustment?: ICurrencyExchangeAdjustment | null;
        device_id: number | null;
        error_code: TransactionErrorCode | null;
        extended_authorization_attributes?: IExtendedAuthorizationAttributes | Record<string, never>;
        gateway: string;
        id: number;
        kind: TransactionKind;
        location_id: number | null;
        message: string | null;
        order_id: number;
        parent_id: number | null;
        payment_details?: IPaymentDetails;
        payments_refund_attributes?: IPaymentsRefund;
        processed_at: string;
        receipt: Record<string, any>;
        source_name: string;
        status: TransactionStatus;
        test: boolean;
        user_id: number | null;
    }
    interface IUsageCharge {
        balance_remaining: number;
        balance_used: number;
        billing_on: string;
        created_at: string;
        description: string;
        id: number;
        price: string;
        risk_level: number;
        recurring_application_charge_id: number;
        updated_at: string;
    }
    interface ICreateUsageCharge {
        description: string;
        price: number;
    }
    type UserPermissions = "applications" | "customers" | "dashboard" | "full" | "gift_cards" | "links" | "marketing" | "order" | "pages" | "preferences" | "products" | "reports" | "themes";
    type UserType = "regular" | "restricted";
    interface IUser {
        account_owner: boolean;
        bio: string;
        email: string;
        first_name: string;
        id: number;
        im: string;
        last_name: string;
        permissions: UserPermissions[];
        phone: string;
        pin: string;
        receive_announcements: number;
        screen_name: string;
        url: string;
        user_type: UserType;
    }
    type ICartLineItem = ICheckoutLineItem;
    interface ICart {
        id: string;
        token: string;
        line_items: ShopifyTypes.ICartLineItem[];
        note: string | null;
        updated_at: string;
        created_at: string;
    }
    type IDeletedItem = {
        id: number;
    };
    type WebhookTopic = "app/uninstalled" | "bulk_operations/finish" | "carts/create" | "carts/update" | "checkouts/create" | "checkouts/delete" | "checkouts/update" | "collection_listings/add" | "collection_listings/remove" | "collection_listings/update" | "collections/create" | "collections/delete" | "collections/update" | "customer_groups/create" | "customer_groups/delete" | "customer_groups/update" | "customers/create" | "customers/delete" | "customers/disable" | "customers/enable" | "customers/update" | "customers_marketing_consent/update" | "draft_orders/create" | "draft_orders/delete" | "draft_orders/update" | "fulfillment_events/create" | "fulfillment_events/delete" | "fulfillments/create" | "fulfillments/update" | "inventory_items/create" | "inventory_items/delete" | "inventory_items/update" | "inventory_levels/connect" | "inventory_levels/disconnect" | "inventory_levels/update" | "locations/create" | "locations/delete" | "locations/update" | "order_transactions/create" | "orders/cancelled" | "orders/create" | "orders/delete" | "orders/edited" | "orders/fulfilled" | "orders/paid" | "orders/partially_fulfilled" | "orders/updated" | "payment_terms/create" | "payment_terms/delete" | "payment_terms/update" | "product_listings/add" | "product_listings/remove" | "product_listings/update" | "products/create" | "products/delete" | "products/update" | "refunds/create" | "selling_plan_groups/create" | "selling_plan_groups/delete" | "selling_plan_groups/update" | "shop/update" | "subscription_billing_attempts/challenged" | "subscription_billing_attempts/failure" | "subscription_billing_attempts/success" | "subscription_contracts/create" | "subscription_contracts/update" | "tender_transactions/create" | "themes/create" | "themes/delete" | "themes/publish" | "themes/update";
    type WebhookFormat = "json" | "xml";
    interface IWebhook {
        address: string;
        created_at: string;
        fields: string[];
        format: WebhookFormat;
        id: number;
        metafield_namespaces: string[];
        private_metafield_namespaces: string[];
        topic: WebhookTopic;
        updated_at: string;
    }
    interface ICreateWebhook {
        address: string;
        fields?: string[];
        format?: WebhookFormat;
        metafield_namespaces?: string[];
        private_metafield_namespaces?: string[];
        topic: WebhookTopic;
    }
    interface IUpdateWebhook {
        address: string;
        fields?: string[];
        format?: WebhookFormat;
        metafield_namespaces?: string[];
        private_metafield_namespaces?: string[];
        topic: WebhookTopic;
    }
    type WebhookType<T extends WebhookTopic> = T extends "app/uninstalled" ? IShop : T extends "carts/create" ? ICart : T extends "carts/update" ? ICart : T extends "checkouts/create" ? ICheckout : T extends "checkouts/update" ? ICheckout : T extends "checkouts/delete" ? IDeletedItem : T extends "collections/create" ? ISmartCollection | ICustomCollection : T extends "collections/update" ? ISmartCollection | ICustomCollection : T extends "collections/delete" ? IDeletedItem : T extends "collection_listings/add" ? ICollectionListing : T extends "collection_listings/remove" ? ICollectionListing : T extends "collection_listings/update" ? ICollectionListing : T extends "customers/create" ? ICustomer : T extends "customers/disable" ? ICustomer : T extends "customers/enable" ? ICustomer : T extends "customers/update" ? ICustomer : T extends "customers/delete" ? IDeletedItem : T extends "customer_groups/create" ? ICustomerSavedSearch : T extends "customer_groups/update" ? ICustomerSavedSearch : T extends "customer_groups/delete" ? IDeletedItem : T extends "draft_orders/create" ? IDraftOrder : T extends "draft_orders/update" ? IDraftOrder : T extends "draft_orders/delete" ? IDeletedItem : T extends "fulfillments/create" ? IFulfillment : T extends "fulfillments/update" ? IFulfillment : T extends "fulfillment_events/create" ? IFulfillmentEvent : T extends "fulfillment_events/delete" ? IDeletedItem : T extends "inventory_items/create" ? IInventoryItem : T extends "inventory_items/update" ? IInventoryItem : T extends "inventory_items/delete" ? IDeletedItem : T extends "inventory_levels/connect" ? IInventoryLevel : T extends "inventory_levels/update" ? IInventoryLevel : T extends "inventory_levels/disconnect" ? IInventoryLevel : T extends "locations/create" ? ILocation : T extends "locations/update" ? ILocation : T extends "locations/delete" ? IDeletedItem : T extends "orders/cancelled" ? IOrder : T extends "orders/create" ? IOrder : T extends "orders/fulfilled" ? IOrder : T extends "orders/paid" ? IOrder : T extends "orders/partially_fulfilled" ? IOrder : T extends "orders/updated" ? IOrder : T extends "orders/delete" ? IDeletedItem : T extends "order_transactions/create" ? ITransaction : T extends "products/create" ? IProduct : T extends "products/update" ? IProduct : T extends "products/delete" ? IDeletedItem : T extends "product_listings/add" ? IProductListing : T extends "product_listings/remove" ? IProductListing : T extends "product_listings/update" ? IProductListing : T extends "refunds/create" ? IRefund : T extends "shop/update" ? IShop : T extends "themes/create" ? ITheme : T extends "themes/publish" ? ITheme : T extends "themes/update" ? ITheme : T extends "themes/delete" ? IDeletedItem : any;
    interface ICarrierAddress {
        country: string;
        postal_code: string;
        province?: string;
        city: string;
        name?: string;
        address1?: string;
        address2?: string;
        address3?: string;
        phone?: string;
        fax?: string;
        email?: string;
        address_type?: string;
        company_name?: string;
    }
    interface ICarrierItem {
        name?: string;
        sku?: string;
        quantity: number;
        grams?: number;
        price: number;
        vendor?: string;
        requires_shipping: boolean;
        taxable: boolean;
        fulfillment_service?: string;
        properties?: {
            [key: string]: string;
        };
        product_id: number;
        variant_id: number;
    }
    interface ICarrierRequestBody {
        origin: ICarrierAddress;
        destination: ICarrierAddress;
        items: ICarrierItem[];
        currency: string;
        locale: string;
    }
    interface ICarrierRequest {
        rate: ICarrierRequestBody;
    }
    interface ICarrierResponse {
        service_name: string;
        description?: string;
        service_code: string;
        currency: string;
        total_price: number;
        phone_required?: boolean;
        min_delivery_date?: string;
        max_delivery_date?: string;
    }
}