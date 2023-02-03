"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertShopifyWeightToGrams = exports.asyncDelay = void 0;
const product_1 = require("../types/product");
/**
 * delay the exection of script for particular time period
 * @param milliSeconds delay in milliseconds
 * @returns a null value after give time
 */
const asyncDelay = async (milliSeconds = 500) => {
    return new Promise((resolve, rej) => {
        try {
            const now = new Date().getTime();
            while (new Date().getTime() < now + milliSeconds) {
                /* Do nothing */
            }
            resolve(null);
        }
        catch (err) {
            rej(err);
        }
    });
};
exports.asyncDelay = asyncDelay;
/**
 * Used to convert the shopify weight into grams
 * @param {SHOPIFY_WEIGHT_UNITS} weightUnit
 * @param {number} weight
 */
const convertShopifyWeightToGrams = (weightUnit, weight) => {
    const shopifyWeightConvertMap = {
        [product_1.SHOPIFY_WEIGHT_UNITS.GRAMS]: 1,
        [product_1.SHOPIFY_WEIGHT_UNITS.KILOGRAMS]: 1000,
        [product_1.SHOPIFY_WEIGHT_UNITS.OUNCES]: 28.35,
        [product_1.SHOPIFY_WEIGHT_UNITS.POUNDS]: 454,
    };
    return (parseFloat(String(shopifyWeightConvertMap[weightUnit])) *
        parseFloat(String(weight)));
};
exports.convertShopifyWeightToGrams = convertShopifyWeightToGrams;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGVscGVycy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBd0Q7QUFFeEQ7Ozs7R0FJRztBQUNJLE1BQU0sVUFBVSxHQUFHLEtBQUssRUFDN0IsZUFBdUIsR0FBRyxFQUNILEVBQUU7SUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNsQyxJQUFJO1lBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQyxPQUFPLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxHQUFHLFlBQVksRUFBRTtnQkFDaEQsZ0JBQWdCO2FBQ2pCO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFkVyxRQUFBLFVBQVUsY0FjckI7QUFFRjs7OztHQUlHO0FBQ0ksTUFBTSwyQkFBMkIsR0FBRyxDQUN6QyxVQUFnQyxFQUNoQyxNQUFjLEVBQ04sRUFBRTtJQUNWLE1BQU0sdUJBQXVCLEdBQUc7UUFDOUIsQ0FBQyw4QkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQy9CLENBQUMsOEJBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSTtRQUN0QyxDQUFDLDhCQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEtBQUs7UUFDcEMsQ0FBQyw4QkFBb0IsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHO0tBQ25DLENBQUM7SUFDRixPQUFPLENBQ0wsVUFBVSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDM0IsQ0FBQztBQUNKLENBQUMsQ0FBQztBQWRXLFFBQUEsMkJBQTJCLCtCQWN0QyJ9