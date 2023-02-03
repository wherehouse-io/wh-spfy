export enum SHOP_TYPE {
  SHOPIFY = "shopify",
  WP = "wordpress",
  CUSTOM = "custom",
  UNICOMMERCE = "unicommerce",
  EASYECOM = "easyecom",
  ECWID = "ecwid",
  MANUAL = "manual", // to handle manual orders
  MANUAL_FBW = "manual FBW", // to handle manual orders that dont required delivery scheduling,
  SHIPWAY = "shipway",
}

export interface ShopifyUrlInstance {
  shopName: string;
  apiKey: string;
  password: string;
}

export interface IHSNResponse {
  productId: string;
  variants: IHSNVariant[];
}
export interface IHSNVariant {
  id: string;
  hsn: string;
}
