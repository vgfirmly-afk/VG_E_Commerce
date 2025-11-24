// services/pricingService.js
// Business logic for pricing operations
import {
  getSkuPrice,
  getSkuPrices,
  getProductPrices,
  updateSkuPrice,
  deleteSkuPrice,
  getPriceHistory,
  getPromotionCode,
  getPromotionCodeById,
  getPromotionCodeByCode,
  listPromotionCodes,
  createPromotionCode,
  updatePromotionCode,
  deletePromotionCode,
  incrementPromotionUsage,
  calculateEffectivePrice,
} from "../db/db1.js";
import { logger, logError } from "../utils/logger.js";

/**
 * Get SKU price with effective price calculation
 */
export async function getPrice(skuId, env) {
  try {
    const priceData = await getSkuPrice(skuId, env);
    if (!priceData) {
      return null;
    }

    const effective = calculateEffectivePrice(priceData);
    return {
      ...priceData,
      ...effective,
    };
  } catch (err) {
    logError("getPrice: Error", err, { skuId });
    throw err;
  }
}

/**
 * Get prices for multiple SKUs
 */
export async function getPrices(skuIds, env) {
  try {
    const prices = await getSkuPrices(skuIds, env);
    return prices.map((priceData) => ({
      ...priceData,
      ...calculateEffectivePrice(priceData),
    }));
  } catch (err) {
    logError("getPrices: Error", err, { skuIds });
    throw err;
  }
}

/**
 * Get all prices for a product
 */
export async function getProductPricing(productId, env) {
  try {
    const prices = await getProductPrices(productId, env);
    return prices.map((priceData) => ({
      ...priceData,
      ...calculateEffectivePrice(priceData),
    }));
  } catch (err) {
    logError("getProductPricing: Error", err, { productId });
    throw err;
  }
}

/**
 * Calculate grand total from SKU IDs and quantities
 */
export async function calculateGrandTotal(
  items,
  promotionCode = null,
  currency = "USD",
  env,
) {
  try {
    const skuIds = items.map((item) => item.sku_id);
    const prices = await getSkuPrices(skuIds, env);

    // Create a map for quick lookup
    const priceMap = new Map();
    prices.forEach((price) => {
      priceMap.set(price.sku_id, calculateEffectivePrice(price));
    });

    // Calculate subtotal
    let subtotal = 0;
    const itemDetails = [];

    for (const item of items) {
      const priceData = priceMap.get(item.sku_id);
      if (!priceData) {
        logError("calculateGrandTotal: SKU price not found", null, {
          sku_id: item.sku_id,
        });
        continue; // Skip items without price
      }

      const itemTotal = priceData.effective_price * item.quantity;
      subtotal += itemTotal;

      itemDetails.push({
        sku_id: item.sku_id,
        sku_code: priceData.sku_code,
        quantity: item.quantity,
        unit_price: priceData.effective_price,
        original_price: priceData.original_price,
        sale_price: priceData.sale_price,
        item_total: itemTotal,
        currency: priceData.currency || currency,
      });
    }

    // Apply promotion code if provided
    let discount = 0;
    let discountAmount = 0;
    let promotion = promotionCode;
    let promotionError = promotionCode
      ? "Promotion code not found or expired"
      : null;

    if (promotionCode) {
      try {
        // Normalize promotion code (trim and uppercase for case-insensitive matching)
        const normalizedCode = promotionCode.trim().toUpperCase();
        console.log(
          "[Pricing Service] Looking up promotion code:",
          normalizedCode,
        );

        const promo = await getPromotionCode(normalizedCode, env);

        if (!promo) {
          promotionError = "Promotion code not found or expired";
          console.log(
            "[Pricing Service] Promotion code not found:",
            normalizedCode,
          );
        } else {
          console.log("[Pricing Service] Found promotion:", {
            code: promo.code,
            status: promo.status,
            valid_from: promo.valid_from,
            valid_to: promo.valid_to,
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
          });

          if (promo.status !== "active") {
            promotionError = `Promotion code is ${promo.status}`;
            console.log(
              "[Pricing Service] Promotion not active:",
              promo.status,
            );
          } else {
            // Check if promotion applies to any of the SKUs
            let applicable = true;
            let failureReason = null;

            if (promo.applicable_skus) {
              try {
                const applicableSkus =
                  typeof promo.applicable_skus === "string"
                    ? JSON.parse(promo.applicable_skus)
                    : promo.applicable_skus;

                if (
                  Array.isArray(applicableSkus) &&
                  applicableSkus.length > 0
                ) {
                  applicable = skuIds.some((skuId) =>
                    applicableSkus.includes(skuId),
                  );
                  if (!applicable) {
                    failureReason =
                      "Promotion code does not apply to items in cart";
                    console.log("[Pricing Service] SKU mismatch:", {
                      cartSkus: skuIds,
                      applicableSkus: applicableSkus,
                    });
                  }
                }
              } catch (parseErr) {
                // If parsing fails, assume all SKUs
                console.log(
                  "[Pricing Service] Failed to parse applicable_skus, assuming all SKUs",
                );
              }
            }

            // Check minimum purchase amount
            if (
              applicable &&
              promo.min_purchase_amount &&
              subtotal < promo.min_purchase_amount
            ) {
              applicable = false;
              failureReason = `Minimum purchase amount of ${promo.min_purchase_amount} required`;
              console.log("[Pricing Service] Minimum purchase not met:", {
                subtotal,
                required: promo.min_purchase_amount,
              });
            }

            // Check usage limit
            if (
              applicable &&
              promo.usage_limit &&
              promo.usage_count >= promo.usage_limit
            ) {
              applicable = false;
              failureReason = "Promotion code usage limit reached";
              console.log("[Pricing Service] Usage limit reached:", {
                usage_count: promo.usage_count,
                limit: promo.usage_limit,
              });
            }

            if (applicable) {
              promotion = {
                code: promo.code,
                name: promo.name,
                discount_type: promo.discount_type,
                discount_value: promo.discount_value,
              };

              if (promo.discount_type === "percentage") {
                discountAmount = (subtotal * promo.discount_value) / 100;

                // Apply max discount limit if set
                if (
                  promo.max_discount_amount &&
                  discountAmount > promo.max_discount_amount
                ) {
                  discountAmount = promo.max_discount_amount;
                }

                console.log(
                  "[Pricing Service] Percentage discount calculated:",
                  {
                    subtotal,
                    percentage: promo.discount_value,
                    discount: discountAmount,
                    max_discount: promo.max_discount_amount,
                  },
                );
              } else if (promo.discount_type === "fixed_amount") {
                discountAmount = promo.discount_value;
                if (discountAmount > subtotal) {
                  discountAmount = subtotal; // Can't discount more than total
                }

                console.log("[Pricing Service] Fixed amount discount:", {
                  discount: discountAmount,
                  subtotal,
                });
              }

              // Increment usage count after successful application
              try {
                await incrementPromotionUsage(normalizedCode, env);
                console.log(
                  "[Pricing Service] Usage count incremented for:",
                  normalizedCode,
                );
              } catch (err) {
                // Log but don't fail the calculation if usage increment fails
                logError("incrementPromotionUsage: Error", err, {
                  code: normalizedCode,
                });
              }
            } else {
              promotionError = failureReason || "Promotion code not applicable";
            }
          }
        }
      } catch (err) {
        logError("calculateGrandTotal: Error processing promotion code", err, {
          promotionCode,
        });
        promotionError = "Error processing promotion code";
      }
    }

    // Calculate final total
    const total = Math.max(0, subtotal - discountAmount);

    logger("grand_total.calculated", {
      item_count: items.length,
      subtotal,
      discount: discountAmount,
      total,
    });

    return {
      items: itemDetails,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discountAmount.toFixed(2)),
      promotion: promotion,
      promotion_error: promotionError || null, // Include error message if promotion failed
      total: parseFloat(total.toFixed(2)),
      currency: currency,
    };
  } catch (err) {
    logError("calculateGrandTotal: Error", err, { items, promotionCode });
    throw err;
  }
}

/**
 * Update SKU price (admin)
 */
export async function updatePrice(skuId, priceData, userId, env) {
  try {
    const updated = await updateSkuPrice(skuId, priceData, userId, env);
    logger("price.updated", { skuId, price: priceData.price });
    return updated;
  } catch (err) {
    logError("updatePrice: Error", err, { skuId, priceData });
    throw err;
  }
}

/**
 * Delete/deactivate SKU price (admin)
 */
export async function deletePrice(skuId, userId, env) {
  try {
    await deleteSkuPrice(skuId, userId, env);
    logger("price.deleted", { skuId });
    return true;
  } catch (err) {
    logError("deletePrice: Error", err, { skuId });
    throw err;
  }
}

/**
 * Get price history for a SKU
 */
export async function getHistory(skuId, query, env) {
  try {
    const history = await getPriceHistory(skuId, query, env);
    logger("price_history.fetched", { skuId, count: history.length });
    return history;
  } catch (err) {
    logError("getHistory: Error", err, { skuId, query });
    throw err;
  }
}

/**
 * Get promotion code by ID (admin)
 */
export async function getPromotionCodeService(promotionId, env) {
  try {
    const promo = await getPromotionCodeById(promotionId, env);
    if (!promo) {
      return null;
    }

    // Parse applicable_skus if it's a string
    if (promo.applicable_skus && typeof promo.applicable_skus === "string") {
      try {
        promo.applicable_skus = JSON.parse(promo.applicable_skus);
      } catch {
        // Keep as string if parsing fails
      }
    }

    return promo;
  } catch (err) {
    logError("getPromotionCodeService: Error", err, { promotionId });
    throw err;
  }
}

/**
 * List promotion codes (admin)
 */
export async function listPromotionCodesService(query, env) {
  try {
    const result = await listPromotionCodes(query, env);

    // Parse applicable_skus for each promotion
    result.promotions = result.promotions.map((promo) => {
      if (promo.applicable_skus && typeof promo.applicable_skus === "string") {
        try {
          promo.applicable_skus = JSON.parse(promo.applicable_skus);
        } catch {
          // Keep as string if parsing fails
        }
      }
      return promo;
    });

    logger("promotion_codes.listed", {
      count: result.promotions.length,
      page: query.page,
    });
    return result;
  } catch (err) {
    logError("listPromotionCodesService: Error", err, { query });
    throw err;
  }
}

/**
 * Create promotion code (admin)
 */
export async function createPromotionCodeService(promoData, userId, env) {
  try {
    const promo = await createPromotionCode(promoData, userId, env);
    logger("promotion_code.created", {
      promotionId: promo.promotion_id,
      code: promo.code,
    });

    // Parse applicable_skus for response
    if (promo.applicable_skus && typeof promo.applicable_skus === "string") {
      try {
        promo.applicable_skus = JSON.parse(promo.applicable_skus);
      } catch {
        // Keep as string if parsing fails
      }
    }

    return promo;
  } catch (err) {
    logError("createPromotionCodeService: Error", err, { promoData });
    throw err;
  }
}

/**
 * Update promotion code (admin)
 */
export async function updatePromotionCodeService(
  promotionId,
  updates,
  userId,
  env,
) {
  try {
    const promo = await updatePromotionCode(promotionId, updates, userId, env);
    logger("promotion_code.updated", {
      promotionId,
      updates: Object.keys(updates),
    });

    // Parse applicable_skus for response
    if (promo.applicable_skus && typeof promo.applicable_skus === "string") {
      try {
        promo.applicable_skus = JSON.parse(promo.applicable_skus);
      } catch {
        // Keep as string if parsing fails
      }
    }

    return promo;
  } catch (err) {
    logError("updatePromotionCodeService: Error", err, {
      promotionId,
      updates,
    });
    throw err;
  }
}

/**
 * Delete promotion code (admin)
 */
export async function deletePromotionCodeService(promotionId, userId, env) {
  try {
    await deletePromotionCode(promotionId, userId, env);
    logger("promotion_code.deleted", { promotionId });
    return true;
  } catch (err) {
    logError("deletePromotionCodeService: Error", err, { promotionId });
    throw err;
  }
}
