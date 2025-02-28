import { ShopifyUrlInstance, SHOP_TYPE } from "../types/shopify";
import { SHOPIFY_WEIGHT_UNITS } from "../types/product";
import { ADDITIONAL_HEADER, WEBHOOK_ID_KEY } from "../constants/product";
import { logger } from "../logger";

/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
export const asyncDelay = async (
  milliSeconds: number = 500
): Promise<null | Error> => {
  return new Promise((resolve, rej) => {
    try {
      setTimeout(() => {
        resolve(null);
      }, milliSeconds);
    } catch (err) {
      rej(err);
    }
  });
};

/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
export const convertShopifyWeightToGrams = (
  weightUnit: SHOPIFY_WEIGHT_UNITS,
  weight: number
): number => {
  const shopifyWeightConvertMap = {
    [SHOPIFY_WEIGHT_UNITS.GRAMS]: 1,
    [SHOPIFY_WEIGHT_UNITS.KILOGRAMS]: 1000,
    [SHOPIFY_WEIGHT_UNITS.OUNCES]: 28.35,
    [SHOPIFY_WEIGHT_UNITS.POUNDS]: 454,
  };
  return (
    parseFloat(String(shopifyWeightConvertMap[weightUnit])) *
    parseFloat(String(weight))
  );
};

export const getShopifyBaseUrl = (
  shopify: ShopifyUrlInstance,
  version?: string
) => {
  return `https://${shopify.apiKey}:${shopify.password}@${
    shopify.shopName
  }/admin/api/${version || "2024-10"}`;
};

export const getShopifyOauthBaseUrl = (shopify: ShopifyUrlInstance) => {
  return `https://${shopify.apiKey}:${shopify.password}@${shopify.shopName}/admin/oauth`;
};

/**
 * Used to extract companyId from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
export const getCompanyId = (shopType: SHOP_TYPE, req: any): string => {
  return String(req.headers[ADDITIONAL_HEADER.COMPANY]);
};

/**
 * Used to extract Webhook Id from the request
 * @param {SHOP_TYPE} shopType
 * @param {IRequest} req
 * @return {string}
 */
export const getWebhookId = (shopType: SHOP_TYPE, req: any): string => {
  let webhookId: string = "";
  const ShopTypeWebhookIdMap = {
    [SHOP_TYPE.SHOPIFY]: WEBHOOK_ID_KEY.SHOPIFY,
    [SHOP_TYPE.WP]: WEBHOOK_ID_KEY.WP,
    [SHOP_TYPE.CUSTOM]: WEBHOOK_ID_KEY.CUSTOM,
  };
  webhookId = req.headers[ShopTypeWebhookIdMap[shopType]].toString();
  return webhookId;
};

export const cleanShopifyIds = (data) => {
  const extractNumericId = (value) => {
    if (typeof value === "string" && value.startsWith("gid://shopify")) {
      const match = value.match(/\d+/); // Extract numeric part
      return match ? match[0] : value;
    }
    return value;
  };

  const traverseAndClean = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => traverseAndClean(item));
    } else if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] =
          key === "createdAt" || key === "updatedAt"
            ? obj[key]
            : traverseAndClean(obj[key]);
        return acc;
      }, {});
    } else if (typeof obj === "string") {
      return extractNumericId(obj);
    }
    return obj;
  };
  return traverseAndClean(data);
};

// function to convert the graphql order object to rest order object

const formattedOrderItem = (orderItems) => {
  const resultedOrderItems = orderItems.map((itm) => {
    const item = itm.node;
    return {
      ...item,
      price: item.originalTotal,
      variantId: item.variant?.id,
      productId: item.product?.id,
      grams: Number(item?.variant?.inventoryItem?.measurement?.weight?.value),
      discountAllocations: formattedDiscountAllocations(
        item.discountAllocations
      ),
      taxLines: formattedTaxLines(item.taxLines),
    };
  });
  return resultedOrderItems;
};

const formattedDiscountAllocations = (discountAllocations) => {
  const resultedDiscountAllocations = discountAllocations.map((discount) => {
    return {
      ...discount,
      amount: discount?.allocatedAmount?.amount,
    };
  });
  return resultedDiscountAllocations;
};

const formattedShippingLines = (shippingLines) => {
  const resultedShippingLines = shippingLines.map((s) => {
    const shippingLine = s.node;
    return {
      ...shippingLine,
      discountedPrice: shippingLine?.discountedPrice?.amount,
    };
  });
  return resultedShippingLines;
};

const formattedTaxLines = (taxline) => {
  const resultedTaxLines = taxline.map((tax) => {
    return {
      ...tax,
      rate: tax.ratePercentage,
    };
  });
  return resultedTaxLines;
};

const formattedFulfillments = (fulfillments) => {
  console.log("fulfillments", fulfillments);
  return fulfillments.map((fulfillment) => {
    return {
      ...fulfillment,
      tracking_company: fulfillment?.trackingInfo?.company ?? " ",
    };
  });
};

const formattedPaymentTerms = (paymentTerms) => {
  console.log("paymentTerms", paymentTerms);
  return {
    ...paymentTerms,
    payment_term_name: paymentTerms.paymentTermsName,
  };
};

export const convertShopifyOrderToRestOrder = (order: any) => {
  // console.log("order", order)
  return {
    billingAddress: order.billingAddress,
    shippingAddress: order.shippingAddress,
    lineItems: formattedOrderItem(order.lineItems.edges),
    taxLines: formattedTaxLines(order.taxLines),
    id: order.id,
    totalWeight: order.totalWeight,
    financialStatus: order.displayFinancialStatus.toLowerCase(),
    customer: order.customer,
    currentTotalPrice: order.currentTotalPriceSet.shopMoney.amount,
    discountCodes: order.discountCodes,
    paymentGatewayNames: order.paymentGatewayNames,
    tags: order.tags[0],
    shippingLines: formattedShippingLines(order.shippingLines.edges),
    taxesIncluded: order.taxesIncluded,
    fulfillments: formattedFulfillments(order.fulfillments),
    cancelledAt: order.cancelledAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    name: order.name,
    // paymentTerms: formattedPaymentTerms(order.paymentTerms),
  };
};

export function transformDataToProductList(data) {
  logger.info(JSON.stringify(data));
  if (!data?.products?.nodes) {
    throw new Error("Invalid data structure: Missing products.nodes");
  }
  return data.products.nodes.map((product) => {
    return {
      ...product,
      id: product.id.match(/\d+/)[0],
      status: product?.status.toLowerCase(),
      images: product?.images?.edges.map((item) => {
        return {
          id: item.node.id,
          src: item.node.src,
        };
      }),
      hasNextPage: data?.products?.pageInfo?.hasNextPage,
      variants: product.variants.nodes.map((variant) => ({
        ...variant,
        id: variant.id.match(/\d+/)[0],
        weight: variant?.inventoryItem?.measurement?.weight?.value,
        weightUnit: variant?.inventoryItem?.measurement?.weight?.unit,
        productId: variant?.product?.id.match(/\d+/)[0],
        imageId: variant?.image?.id || "",
        inventory_item_id: variant?.inventoryItem?.id.match(/\d+/)[0],
      })),
    };
  });
}
