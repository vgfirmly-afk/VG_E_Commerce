// services/cartService.js
import { logger, logError, logWarn } from "../utils/logger.js";
import {
  getOrCreateCart,
  getCartById as getCartByIdDb,
  getCartItems,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
  getCartItem,
} from "../db/db1.js";

/**
 * Get price from Pricing Worker via service binding
 */
async function getPriceFromPricingWorker(skuId, env) {
  try {
    const pricingWorker = env.PRICING_WORKER;
    if (!pricingWorker) {
      logError(
        "getPriceFromPricingWorker: PRICING_WORKER binding not available",
        null,
        { skuId },
      );
      return null;
    }

    const priceRequest = new Request(
      `https://pricing-worker/api/v1/prices/${encodeURIComponent(skuId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Source": "cart-worker-service-binding",
        },
      },
    );

    const response = await pricingWorker.fetch(priceRequest);
    if (!response.ok) {
      logError("getPriceFromPricingWorker: Failed to get price", null, {
        skuId,
        status: response.status,
      });
      return null;
    }

    const priceData = await response.json();
    return priceData.effective_price || priceData.price || 0.0;
  } catch (err) {
    logError("getPriceFromPricingWorker: Error", err, { skuId });
    return null;
  }
}

/**
 * Get full price data from Pricing Worker via service binding
 * Returns the complete price object including product_name, attributes, stock, etc.
 */
async function getFullPriceDataFromPricingWorker(skuId, env) {
  try {
    const pricingWorker = env.PRICING_WORKER;
    if (!pricingWorker) {
      logError(
        "getFullPriceDataFromPricingWorker: PRICING_WORKER binding not available",
        null,
        { skuId },
      );
      return null;
    }

    const priceRequest = new Request(
      `https://pricing-worker/api/v1/prices/${encodeURIComponent(skuId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Source": "cart-worker-service-binding",
        },
      },
    );

    const response = await pricingWorker.fetch(priceRequest);
    if (!response.ok) {
      logError("getFullPriceDataFromPricingWorker: Failed to get price", null, {
        skuId,
        status: response.status,
      });
      return null;
    }

    const priceData = await response.json();
    return priceData;
  } catch (err) {
    logError("getFullPriceDataFromPricingWorker: Error", err, { skuId });
    return null;
  }
}

/**
 * Check stock availability from Inventory Worker via service binding
 */
async function checkStockFromInventoryWorker(skuId, quantity, env) {
  try {
    const inventoryWorker = env.INVENTORY_WORKER;
    if (!inventoryWorker) {
      logError(
        "checkStockFromInventoryWorker: INVENTORY_WORKER binding not available",
        null,
        { skuId },
      );
      return { available: false, reason: "Inventory Worker not available" };
    }

    const stockRequest = new Request(
      `https://inventory-worker/api/v1/stock/${encodeURIComponent(skuId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Source": "cart-worker-service-binding",
        },
      },
    );

    const response = await inventoryWorker.fetch(stockRequest);
    if (!response.ok) {
      logError("checkStockFromInventoryWorker: Failed to check stock", null, {
        skuId,
        status: response.status,
      });
      return { available: false, reason: "Stock check failed" };
    }

    const stockData = await response.json();
    const availableQuantity = stockData.available_quantity || 0;

    if (availableQuantity < quantity) {
      return {
        available: false,
        reason: `Insufficient stock. Available: ${availableQuantity}, Requested: ${quantity}`,
        availableQuantity,
      };
    }

    return {
      available: true,
      availableQuantity,
      stock: stockData,
    };
  } catch (err) {
    logError("checkStockFromInventoryWorker: Error", err, { skuId });
    return { available: false, reason: "Stock check error" };
  }
}

/**
 * Get or create cart
 */
export async function getCart(userId, sessionId, env) {
  try {
    const cart = await getOrCreateCart(userId, sessionId, env);
    if (!cart) {
      throw new Error("Failed to create cart");
    }
    const items = await getCartItems(cart.cart_id, env);

    return {
      cart_id: cart.cart_id,
      user_id: cart.user_id,
      session_id: cart.session_id,
      status: cart.status,
      currency: cart.currency,
      items: items.map((item) => ({
        item_id: item.item_id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        currency: item.currency,
      })),
      item_count: items.length,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };
  } catch (err) {
    logError("getCart: Service error", err, { userId, sessionId });
    throw err;
  }
}

/**
 * Get cart by ID
 */
export async function getCartByIdService(cartId, env) {
  try {
    const cart = await getCartByIdDb(cartId, env);
    if (!cart) {
      return null;
    }

    const items = await getCartItems(cartId, env);

    return {
      cart_id: cart.cart_id,
      user_id: cart.user_id,
      session_id: cart.session_id,
      status: cart.status,
      currency: cart.currency,
      items: items.map((item) => ({
        item_id: item.item_id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        currency: item.currency,
      })),
      item_count: items.length,
      created_at: cart.created_at,
      updated_at: cart.updated_at,
    };
  } catch (err) {
    logError("getCartById: Service error", err, { cartId });
    throw err;
  }
}

/**
 * Add item to cart
 */
export async function addItem(cartId, skuId, quantity, env) {
  try {
    // Check stock availability
    const stockCheck = await checkStockFromInventoryWorker(
      skuId,
      quantity,
      env,
    );
    if (!stockCheck.available) {
      throw new Error(stockCheck.reason || "Insufficient stock");
    }

    const currency = "USD"; // Default currency

    const item = await addItemToCart(cartId, skuId, quantity, currency, env);

    logger("cart.item.added", { cartId, skuId, quantity });
    return item;
  } catch (err) {
    logError("addItem: Service error", err, { cartId, skuId, quantity });
    throw err;
  }
}

/**
 * Update item quantity
 * Supports both absolute quantity and relative delta (increment/decrement)
 * @param {string} itemId - Cart item ID
 * @param {number|null} quantity - Absolute quantity (if provided, sets quantity to this value)
 * @param {number|null} delta - Relative change (if provided, adds/subtracts from current quantity)
 * @param {Object} env - Environment
 */
export async function updateQuantity(itemId, quantity, delta, env) {
  try {
    // Get current item to check if it exists and get current quantity
    const currentItem = await getCartItem(itemId, env);
    if (!currentItem) {
      throw new Error("Cart item not found");
    }

    let newQuantity;

    // If delta is provided, calculate relative change
    if (delta !== undefined && delta !== null) {
      newQuantity = currentItem.quantity + delta;
      // Ensure quantity doesn't go below 0
      if (newQuantity < 0) {
        newQuantity = 0;
      }
    } else if (quantity !== undefined && quantity !== null) {
      // Use absolute quantity
      newQuantity = quantity;
    } else {
      throw new Error("Either quantity or delta is required");
    }

    // If increasing quantity, check stock availability
    if (newQuantity > currentItem.quantity) {
      const quantityIncrease = newQuantity - currentItem.quantity;
      const stockCheck = await checkStockFromInventoryWorker(
        currentItem.sku_id,
        newQuantity,
        env,
      );
      if (!stockCheck.available) {
        throw new Error(stockCheck.reason || "Insufficient stock");
      }
    }

    const item = await updateItemQuantity(itemId, newQuantity, env);
    logger("cart.item.updated", {
      itemId,
      oldQuantity: currentItem.quantity,
      newQuantity,
      delta,
    });
    return item;
  } catch (err) {
    logError("updateQuantity: Service error", err, { itemId, quantity, delta });
    throw err;
  }
}

/**
 * Remove item from cart
 */
export async function removeItem(itemId, env) {
  try {
    await removeItemFromCart(itemId, env);
    logger("cart.item.removed", { itemId });
    return true;
  } catch (err) {
    logError("removeItem: Service error", err, { itemId });
    throw err;
  }
}

/**
 * Clear cart
 */
export async function clear(cartId, env) {
  try {
    await clearCart(cartId, env);
    logger("cart.cleared", { cartId });
    return true;
  } catch (err) {
    logError("clear: Service error", err, { cartId });
    throw err;
  }
}

/**
 * Calculate cart total (with prices from Pricing Worker)
 */
export async function calculateTotal(cartId, env) {
  try {
    const cart = await getCartByIdService(cartId, env);
    if (!cart) {
      throw new Error("Cart not found");
    }

    const items = cart.items || [];
    const pricingWorker = env.PRICING_WORKER;

    let subtotal = 0;
    const itemTotals = [];

    for (const item of items) {
      // Get current price from Pricing Worker
      let currentPrice = 0.0;

      if (pricingWorker) {
        const price = await getPriceFromPricingWorker(item.sku_id, env);
        if (price !== null) {
          currentPrice = price;
        }
      }

      const itemTotal = currentPrice * item.quantity;
      subtotal += itemTotal;

      itemTotals.push({
        item_id: item.item_id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        unit_price: currentPrice,
        total: itemTotal,
      });
    }

    return {
      cart_id: cartId,
      subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      currency: cart.currency || "USD",
      item_count: items.length,
      items: itemTotals,
    };
  } catch (err) {
    logError("calculateTotal: Service error", err, { cartId });
    throw err;
  }
}

/**
 * Get or create cart with enriched pricing data
 * - Gets or creates cart based on userId and sessionId
 * - If cart has items:
 *   - Fetches prices for all SKUs in parallel from Pricing Worker
 *   - Calculates cart total using the fetched prices (no duplicate calls)
 *   - Merges all data into a single response
 */
export async function getCartWithEnrichedPricing(userId, sessionId, env) {
  try {
    // Get or create cart
    const cart = await getCart(userId, sessionId, env);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      // Return cart without pricing data if no items
      return {
        ...cart,
        total: null,
        item_prices: [],
      };
    }

    // Fetch prices for all SKUs in parallel (only once)
    const pricePromises = cart.items.map((item) =>
      getFullPriceDataFromPricingWorker(item.sku_id, env)
    );
    
    const priceResults = await Promise.all(pricePromises);

    // Calculate total using the already-fetched price data (avoid duplicate calls)
    let subtotal = 0;
    const itemTotals = [];
    const itemPrices = cart.items.map((item, index) => {
      const priceData = priceResults[index];
      // Extract price from the fetched data
      const currentPrice = priceData 
        ? (priceData.effective_price || priceData.price || 0.0)
        : 0.0;
      
      const itemTotal = currentPrice * item.quantity;
      subtotal += itemTotal;

      itemTotals.push({
        item_id: item.item_id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        unit_price: currentPrice,
        total: itemTotal,
      });

      return {
        item_id: item.item_id,
        sku_id: item.sku_id,
        quantity: item.quantity,
        currency: item.currency,
        price_data: priceData || null,
      };
    });

    // Build total object using the calculated values
    const total = {
      cart_id: cart.cart_id,
      subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
      currency: cart.currency || "USD",
      item_count: cart.items.length,
      items: itemTotals,
    };

    // Merge all data
    return {
      ...cart,
      total: total,
      item_prices: itemPrices,
    };
  } catch (err) {
    logError("getCartWithEnrichedPricing: Service error", err, { userId, sessionId });
    throw err;
  }
}