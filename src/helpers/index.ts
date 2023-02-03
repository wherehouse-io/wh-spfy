import { SHOPIFY_WEIGHT_UNITS } from "../types/product";

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
      const now = new Date().getTime();
      while (new Date().getTime() < now + milliSeconds) {
        /* Do nothing */
      }
      resolve(null);
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
