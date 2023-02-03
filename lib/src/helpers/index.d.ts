import { SHOPIFY_WEIGHT_UNITS } from "../types/product";
/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
export declare const asyncDelay: (milliSeconds?: number) => Promise<null | Error>;
/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
export declare const convertShopifyWeightToGrams: (weightUnit: SHOPIFY_WEIGHT_UNITS, weight: number) => number;
