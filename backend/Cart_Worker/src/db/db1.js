// db/db1.js
// CART_DB helpers for carts and cart items
import { v4 as uuidv4 } from "uuid";
import { logger, logError } from "../utils/logger.js";

/**
 * Get or create cart for user (logged in or anonymous)
 */
export async function getOrCreateCart(userId, sessionId, env) {
  try {
    const now = new Date().toISOString();
    const expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(); // 30 days

    // If user is logged in, try to find existing cart
    if (userId) {
      const existing = await env.CART_DB.prepare(
        "SELECT * FROM carts WHERE user_id = ? AND status = ? ORDER BY updated_at DESC LIMIT 1",
      )
        .bind(userId, "active")
        .first();

      if (existing) {
        return existing;
      }
    } else if (sessionId) {
      // For anonymous users, try to find cart by session
      const existing = await env.CART_DB.prepare(
        "SELECT * FROM carts WHERE session_id = ? AND status = ? ORDER BY updated_at DESC LIMIT 1",
      )
        .bind(sessionId, "active")
        .first();

      if (existing) {
        return existing;
      }
    }

    // Create new cart
    const cartId = uuidv4();
    await env.CART_DB.prepare(
      `
      INSERT INTO carts (cart_id, user_id, session_id, status, currency, created_at, updated_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
      .bind(
        cartId,
        userId || null,
        sessionId || null,
        "active",
        "USD",
        now,
        now,
        expiresAt,
      )
      .run();

    logger("cart.created", { cartId, userId, sessionId });
    return await getCartById(cartId, env);
  } catch (err) {
    logError("getOrCreateCart: Database error", err, { userId, sessionId });
    throw err;
  }
}

/**
 * Get cart by ID
 */
export async function getCartById(cartId, env) {
  try {
    const cart = await env.CART_DB.prepare(
      "SELECT * FROM carts WHERE cart_id = ?",
    )
      .bind(cartId)
      .first();
    return cart || null;
  } catch (err) {
    logError("getCartById: Database error", err, { cartId });
    throw err;
  }
}

/**
 * Get cart items
 */
export async function getCartItems(cartId, env) {
  try {
    const res = await env.CART_DB.prepare(
      "SELECT * FROM cart_items WHERE cart_id = ? ORDER BY added_at DESC",
    )
      .bind(cartId)
      .all();
    return res?.results || [];
  } catch (err) {
    logError("getCartItems: Database error", err, { cartId });
    throw err;
  }
}

/**
 * Get cart item by ID
 */
export async function getCartItem(itemId, env) {
  try {
    const item = await env.CART_DB.prepare(
      "SELECT * FROM cart_items WHERE item_id = ?",
    )
      .bind(itemId)
      .first();
    return item || null;
  } catch (err) {
    logError("getCartItem: Database error", err, { itemId });
    throw err;
  }
}

/**
 * Add item to cart
 */
export async function addItemToCart(cartId, skuId, quantity, currency, env) {
  try {
    const now = new Date().toISOString();

    // Check if item already exists in cart
    const existing = await env.CART_DB.prepare(
      "SELECT * FROM cart_items WHERE cart_id = ? AND sku_id = ?",
    )
      .bind(cartId, skuId)
      .first();

    if (existing) {
      // Update quantity
      const newQuantity = existing.quantity + quantity;
      await env.CART_DB.prepare(
        `
        UPDATE cart_items 
        SET quantity = ?, updated_at = ?
        WHERE item_id = ?
      `,
      )
        .bind(newQuantity, now, existing.item_id)
        .run();

      // Update cart updated_at
      await env.CART_DB.prepare(
        "UPDATE carts SET updated_at = ? WHERE cart_id = ?",
      )
        .bind(now, cartId)
        .run();

      // Log history
      await logCartHistory(
        cartId,
        "update_quantity",
        skuId,
        existing.quantity,
        newQuantity,
        "system",
        env,
      );

      return await getCartItem(existing.item_id, env);
    } else {
      // Add new item
      const itemId = uuidv4();
      await env.CART_DB.prepare(
        `
        INSERT INTO cart_items (item_id, cart_id, sku_id, quantity, currency, added_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      )
        .bind(itemId, cartId, skuId, quantity, currency, now, now)
        .run();

      // Update cart updated_at
      await env.CART_DB.prepare(
        "UPDATE carts SET updated_at = ? WHERE cart_id = ?",
      )
        .bind(now, cartId)
        .run();

      // Log history
      await logCartHistory(
        cartId,
        "add_item",
        skuId,
        0,
        quantity,
        "system",
        env,
      );

      return await getCartItem(itemId, env);
    }
  } catch (err) {
    logError("addItemToCart: Database error", err, { cartId, skuId, quantity });
    throw err;
  }
}

/**
 * Update item quantity
 */
export async function updateItemQuantity(itemId, quantity, env) {
  try {
    const item = await getCartItem(itemId, env);
    if (!item) {
      throw new Error("Cart item not found");
    }

    const now = new Date().toISOString();

    if (quantity === 0) {
      // Remove item
      await env.CART_DB.prepare("DELETE FROM cart_items WHERE item_id = ?")
        .bind(itemId)
        .run();

      // Update cart updated_at
      await env.CART_DB.prepare(
        "UPDATE carts SET updated_at = ? WHERE cart_id = ?",
      )
        .bind(now, item.cart_id)
        .run();

      // Log history
      await logCartHistory(
        item.cart_id,
        "remove_item",
        item.sku_id,
        item.quantity,
        0,
        "system",
        env,
      );

      return null;
    } else {
      // Update quantity
      await env.CART_DB.prepare(
        `
        UPDATE cart_items 
        SET quantity = ?, updated_at = ?
        WHERE item_id = ?
      `,
      )
        .bind(quantity, now, itemId)
        .run();

      // Update cart updated_at
      await env.CART_DB.prepare(
        "UPDATE carts SET updated_at = ? WHERE cart_id = ?",
      )
        .bind(now, item.cart_id)
        .run();

      // Log history
      await logCartHistory(
        item.cart_id,
        "update_quantity",
        item.sku_id,
        item.quantity,
        quantity,
        "system",
        env,
      );

      return await getCartItem(itemId, env);
    }
  } catch (err) {
    logError("updateItemQuantity: Database error", err, { itemId, quantity });
    throw err;
  }
}

/**
 * Remove item from cart
 */
export async function removeItemFromCart(itemId, env) {
  try {
    const item = await getCartItem(itemId, env);
    if (!item) {
      throw new Error("Cart item not found");
    }

    const now = new Date().toISOString();

    await env.CART_DB.prepare("DELETE FROM cart_items WHERE item_id = ?")
      .bind(itemId)
      .run();

    // Update cart updated_at
    await env.CART_DB.prepare(
      "UPDATE carts SET updated_at = ? WHERE cart_id = ?",
    )
      .bind(now, item.cart_id)
      .run();

    // Log history
    await logCartHistory(
      item.cart_id,
      "remove_item",
      item.sku_id,
      item.quantity,
      0,
      "system",
      env,
    );

    return true;
  } catch (err) {
    logError("removeItemFromCart: Database error", err, { itemId });
    throw err;
  }
}

/**
 * Clear cart
 */
export async function clearCart(cartId, env) {
  try {
    const now = new Date().toISOString();

    await env.CART_DB.prepare("DELETE FROM cart_items WHERE cart_id = ?")
      .bind(cartId)
      .run();

    await env.CART_DB.prepare(
      "UPDATE carts SET updated_at = ? WHERE cart_id = ?",
    )
      .bind(now, cartId)
      .run();

    // Log history
    await logCartHistory(cartId, "clear_cart", null, null, null, "system", env);

    logger("cart.cleared", { cartId });
    return true;
  } catch (err) {
    logError("clearCart: Database error", err, { cartId });
    throw err;
  }
}

/**
 * Log cart history
 */
async function logCartHistory(
  cartId,
  action,
  skuId,
  quantityBefore,
  quantityAfter,
  changedBy,
  env,
) {
  try {
    const now = new Date().toISOString();
    await env.CART_DB.prepare(
      `
      INSERT INTO cart_history (history_id, cart_id, action, sku_id, quantity_before, quantity_after, changed_by, changed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    )
      .bind(
        uuidv4(),
        cartId,
        action,
        skuId || null,
        quantityBefore || null,
        quantityAfter || null,
        changedBy,
        now,
      )
      .run();
  } catch (err) {
    // Don't fail if history logging fails
    logError("logCartHistory: Error", err, { cartId, action });
  }
}
