import { FulfillmentProviders } from "./fulfillment";

// This limit is for shopify product listing, it can be maximum 100
export const DEFAULT_PAGINATION_LIMIT_SHOPIFY_PRODUCT_LIST = 100;

export enum EVENT_TYPE {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  NO_UPDATE = "no_update",
}

export interface IProductDelete {
  productId: string;
  eventType: string;
  companyId: string;
  shopType: SHOP_TYPE;
  webhookId: string;
}

export enum SHOP_TYPE {
  SHOPIFY = "shopify",
  WP = "wordpress",
  CUSTOM = "custom",
  UNICOMMERCE = "unicommerce",
  EASYECOM = "easyecom",
  SHIPWAY = "shipway",
}

export enum PRODUCT_TYPE {
  SIMPLE = "simple",
  GROUPED = "grouped",
  VARIABLE = "variable",
  VARIATION = "variation",
}

export enum SHOPIFY_WEIGHT_UNITS {
  GRAMS = "GRAMS",
  KILOGRAMS = "KILOGRAMS",
  OUNCES = "OUNCES",
  POUNDS = "POUNDS",
}

export enum SHOPIFY_PRODUCT_STATUS {
  ACTIVE = "active",
}

export enum WEIGHT_UNIT {
  GRAM = "g",
}

export enum WP_TAX_STATUS {
  TAXABLE = "taxable",
  SHIPPING = "shipping",
}

export enum WP_PRODUCT_STATUS {
  DRAFT = "draft",
  PENDING = "pending",
  PRIVATE = "private",
  PUBLISH = "publish",
}

export enum WP_ORDER_STATUS {
  PROCESSING = "processing",
  CANCELLED = "cancelled",
}

export interface IAggregatorCourierIdAndName {
  cp_id: string;
  cp_name: string;
}

export const aggregatorWhomsShipperWeCanSelect = [
  FulfillmentProviders.SHIPROCKET,
  FulfillmentProviders.GOSWIFT,
];

export interface IAggregatorCourierPartner {
  courier_company_id: string;
  courier_name: string;
  isPriceAndEddAvailabe: boolean;
  aggregator: string;
  freight_charge: string;
  etd: string;
}

export interface IAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  company?: string;
}

export interface IGstPercentage {
  igst: string;
  cgst: string;
  sgst: string;
  utgst: string;
}

export interface IDimensions {
  length?: number;
  height?: number;
  breadth?: number;
}

export interface IProductIngress {
  _id: string;
  webhookId: string;
  variantId: string;
  eventType: string;
  shopType: SHOP_TYPE;
  companyId: string;
  productTitle: string;
  category: string;
  variantTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
  weight: number;
  weightUnit: string;
  active: boolean;
  sku: string;
  productId: string;
  price: number;
  inventoryQuantity?: number;
  barcode?: string;
  hsnCode?: string;
  handle?: string;
  imageUrls?: string[];
  productType: PRODUCT_TYPE;
  dimensions: string;
  gstPercentage?: IGstPercentage;
  isActive: boolean;
}

export interface IProductOms {
  variantId: string;
  shopType: SHOP_TYPE;
  companyId: string;
  productTitle: string;
  category: string;
  variantTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
  weight: number;
  weightUnit: string;
  taxable: boolean;
  isActive: boolean;
  sku: string;
  skuId?: string;
  productId: string;
  price: number;
  inventoryQuantity?: number;
  barcode?: string;
  hsnCode?: string;
  handle?: string;
  imageUrls?: string[];
  productType: PRODUCT_TYPE;
  dimensions: IDimensions;
  active?: boolean;
  gstPercentage?: any;
}

export interface IProduct {
  _id: string;
  webhookId: string;
  variantId: string;
  eventType: string;
  shopType: SHOP_TYPE;
  companyId: string;
  productTitle: string;
  category: string;
  variantTitle: string;
  createdAt?: Date;
  updatedAt?: Date;
  weight: number;
  weightUnit: string;
  taxable: boolean;
  m: any;
  isActive: boolean;
  sku: string;
  skuId?: string;
  productId: string;
  price: number;
  inventoryQuantity?: number;
  barcode?: string;
  hsnCode?: string;
  handle?: string;
  imageUrls?: string[];
  productType: PRODUCT_TYPE;
  dimensions?: IDimensions;
}
