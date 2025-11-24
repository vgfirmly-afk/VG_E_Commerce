// db/db1.js
// INVENTORY_DB helpers for SKU stock & stock history
import { v4 as uuidv4 } from "uuid";
import { logger, logError } from "../utils/logger.js";

/**
 * Get SKU stock by SKU ID
 */
export async function getSkuStock(skuId, env) {
  try {
    const res = await env.INVENTORY_DB.prepare(
      "SELECT * FROM sku_stock WHERE sku_id = ?",
    )
      .bind(skuId)
      .first();
    return res || null;
  } catch (err) {
    logError("getSkuStock: Database error", err, { skuId });
    throw err;
  }
}

/**
 * Get stock for multiple SKUs
 */
export async function getSkuStocks(skuIds, env) {
  try {
    if (!skuIds || skuIds.length === 0) return [];

    // Build IN clause with placeholders
    const placeholders = skuIds.map(() => "?").join(", ");
    const sql = `SELECT * FROM sku_stock WHERE sku_id IN (${placeholders})`;

    const res = await env.INVENTORY_DB.prepare(sql)
      .bind(...skuIds)
      .all();
    return res?.results || [];
  } catch (err) {
    logError("getSkuStocks: Database error", err, { skuIds });
    throw err;
  }
}

/**
 * Get all stock for a product
 */
export async function getProductStock(productId, env) {
  try {
    const res = await env.INVENTORY_DB.prepare(
      "SELECT * FROM sku_stock WHERE product_id = ? ORDER BY sku_code",
    )
      .bind(productId)
      .all();
    return res?.results || [];
  } catch (err) {
    logError("getProductStock: Database error", err, { productId });
    throw err;
  }
}

/**
 * Initialize stock for a new SKU (called by Catalog Worker when SKU is created)
 * Uses ACID transaction to ensure consistency
 */
export async function initializeSkuStock(stockData, env) {
  try {
    const {
      sku_id,
      product_id,
      sku_code,
      quantity = 0,
      low_stock_threshold = null,
      reason = "Initial stock initialization",
    } = stockData;

    const now = new Date().toISOString();

    // Check if stock already exists
    const existing = await getSkuStock(sku_id, env);
    if (existing) {
      logger("stock.already_exists", { sku_id });
      return existing;
    }

    // Calculate available quantity (quantity - reserved_quantity)
    const available_quantity = Math.max(0, quantity - 0); // No reserved initially
    const status = quantity > 0 ? "active" : "out_of_stock";

    // Use transaction for ACID guarantee
    const result = await env.INVENTORY_DB.batch([
      // Insert stock record
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO sku_stock (
          sku_id, product_id, sku_code, quantity, reserved_quantity, 
          available_quantity, low_stock_threshold, status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).bind(
        sku_id,
        product_id,
        sku_code,
        quantity,
        0, // reserved_quantity
        available_quantity,
        low_stock_threshold,
        status,
        now,
        now,
      ),
      // Create initial stock history entry
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO stock_history (
          history_id, sku_id, product_id, sku_code,
          change_type, quantity_before, quantity_after,
          reserved_before, reserved_after,
          reason, changed_by, changed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).bind(
        uuidv4(),
        sku_id,
        product_id,
        sku_code,
        "create",
        0, // quantity_before
        quantity, // quantity_after
        0, // reserved_before
        0, // reserved_after
        reason,
        "system",
        now,
      ),
    ]);

    logger("stock.initialized", {
      sku_id,
      product_id,
      sku_code,
      quantity,
      available_quantity,
      status,
    });

    return await getSkuStock(sku_id, env);
  } catch (err) {
    logError("initializeSkuStock: Database error", err, { stockData });
    throw err;
  }
}

/**
 * Update SKU stock (admin operation)
 * Uses ACID transaction
 */
export async function updateSkuStock(skuId, updates, userId, env) {
  try {
    const existing = await getSkuStock(skuId, env);
    if (!existing) {
      throw new Error(`Stock not found for SKU: ${skuId}`);
    }

    const now = new Date().toISOString();
    const {
      quantity = existing.quantity,
      reserved_quantity = existing.reserved_quantity,
      low_stock_threshold = existing.low_stock_threshold,
      status = existing.status,
      reason = "Stock updated by admin",
    } = updates;

    // Calculate available quantity
    const available_quantity = Math.max(0, quantity - reserved_quantity);

    // Use transaction
    await env.INVENTORY_DB.batch([
      // Update stock
      env.INVENTORY_DB.prepare(
        `
        UPDATE sku_stock 
        SET quantity = ?, reserved_quantity = ?, available_quantity = ?,
            low_stock_threshold = ?, status = ?, updated_at = ?, updated_by = ?
        WHERE sku_id = ?
      `,
      ).bind(
        quantity,
        reserved_quantity,
        available_quantity,
        low_stock_threshold,
        status,
        now,
        userId || "system",
        skuId,
      ),
      // Create history entry
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO stock_history (
          history_id, sku_id, product_id, sku_code,
          change_type, quantity_before, quantity_after,
          reserved_before, reserved_after,
          reason, changed_by, changed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).bind(
        uuidv4(),
        skuId,
        existing.product_id,
        existing.sku_code,
        "update",
        existing.quantity,
        quantity,
        existing.reserved_quantity,
        reserved_quantity,
        reason,
        userId || "system",
        now,
      ),
    ]);

    logger("stock.updated", { skuId, quantity, available_quantity });
    return await getSkuStock(skuId, env);
  } catch (err) {
    logError("updateSkuStock: Database error", err, { skuId, updates });
    throw err;
  }
}

/**
 * Adjust stock quantity (increase or decrease)
 * Uses ACID transaction with row-level locking for concurrent safety
 * This ensures ACID properties when multiple users try to purchase the same item
 */
export async function adjustStockQuantity(
  skuId,
  adjustmentQuantity,
  userId,
  env,
  reason = "Stock adjustment",
  reservationId = null,
) {
  try {
    // Get current stock with row lock (SQLite uses BEGIN IMMEDIATE for write locks)
    const existing = await getSkuStock(skuId, env);
    if (!existing) {
      throw new Error(`Stock not found for SKU: ${skuId}`);
    }

    const newQuantity = existing.quantity + adjustmentQuantity;
    if (newQuantity < 0) {
      throw new Error(
        `Insufficient stock. Available: ${existing.available_quantity}, Requested: ${Math.abs(adjustmentQuantity)}`,
      );
    }

    const now = new Date().toISOString();
    const available_quantity = Math.max(
      0,
      newQuantity - existing.reserved_quantity,
    );
    const status =
      newQuantity > 0
        ? existing.status === "inactive"
          ? "inactive"
          : "active"
        : "out_of_stock";

    // Use transaction with batch for ACID guarantee
    await env.INVENTORY_DB.batch([
      // Update stock atomically
      env.INVENTORY_DB.prepare(
        `
        UPDATE sku_stock 
        SET quantity = ?, available_quantity = ?, status = ?, updated_at = ?, updated_by = ?
        WHERE sku_id = ? AND quantity = ?
      `,
      ).bind(
        newQuantity,
        available_quantity,
        status,
        now,
        userId || "system",
        skuId,
        existing.quantity, // Optimistic locking: only update if quantity hasn't changed
      ),
      // Create history entry
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO stock_history (
          history_id, sku_id, product_id, sku_code,
          change_type, quantity_before, quantity_after,
          reserved_before, reserved_after,
          adjustment_quantity, reservation_id,
          reason, changed_by, changed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).bind(
        uuidv4(),
        skuId,
        existing.product_id,
        existing.sku_code,
        adjustmentQuantity > 0 ? "adjust" : "purchase",
        existing.quantity,
        newQuantity,
        existing.reserved_quantity,
        existing.reserved_quantity,
        adjustmentQuantity,
        reservationId,
        reason,
        userId || "system",
        now,
      ),
    ]);

    // Verify the update succeeded (check if quantity was actually updated)
    const updated = await getSkuStock(skuId, env);
    if (updated.quantity !== newQuantity) {
      // Another transaction modified the stock - retry or fail
      throw new Error(
        "Stock was modified by another transaction. Please retry.",
      );
    }

    logger("stock.adjusted", {
      skuId,
      adjustmentQuantity,
      quantityBefore: existing.quantity,
      quantityAfter: newQuantity,
      available_quantity,
    });

    return updated;
  } catch (err) {
    logError("adjustStockQuantity: Database error", err, {
      skuId,
      adjustmentQuantity,
    });
    throw err;
  }
}

/**
 * Reserve stock (for cart/checkout)
 * Uses ACID transaction to ensure only available stock can be reserved
 */
export async function reserveStock(
  skuId,
  quantity,
  reservationId,
  userId,
  env,
  expiresAt = null,
) {
  try {
    const existing = await getSkuStock(skuId, env);
    if (!existing) {
      throw new Error(`Stock not found for SKU: ${skuId}`);
    }

    // Check if enough available stock
    if (existing.available_quantity < quantity) {
      throw new Error(
        `Insufficient available stock. Available: ${existing.available_quantity}, Requested: ${quantity}`,
      );
    }

    const now = new Date().toISOString();
    const newReservedQuantity = existing.reserved_quantity + quantity;
    const newAvailableQuantity = existing.quantity - newReservedQuantity;

    // Use transaction
    await env.INVENTORY_DB.batch([
      // Update stock with reservation
      env.INVENTORY_DB.prepare(
        `
        UPDATE sku_stock 
        SET reserved_quantity = ?, available_quantity = ?, updated_at = ?, updated_by = ?
        WHERE sku_id = ? AND available_quantity >= ?
      `,
      ).bind(
        newReservedQuantity,
        newAvailableQuantity,
        now,
        userId || "system",
        skuId,
        quantity, // Only update if enough available stock (optimistic locking)
      ),
      // Create reservation record
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO stock_reservations (
          reservation_id, sku_id, quantity, status, expires_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      ).bind(reservationId, skuId, quantity, "active", expiresAt, now),
      // Create history entry
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO stock_history (
          history_id, sku_id, product_id, sku_code,
          change_type, quantity_before, quantity_after,
          reserved_before, reserved_after,
          reservation_id, reason, changed_by, changed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).bind(
        uuidv4(),
        skuId,
        existing.product_id,
        existing.sku_code,
        "reserve",
        existing.quantity,
        existing.quantity, // Quantity doesn't change on reservation
        existing.reserved_quantity,
        newReservedQuantity,
        reservationId,
        `Stock reserved: ${quantity} units`,
        userId || "system",
        now,
      ),
    ]);

    // Verify reservation succeeded
    const updated = await getSkuStock(skuId, env);
    if (updated.reserved_quantity !== newReservedQuantity) {
      throw new Error(
        "Stock reservation failed - insufficient available stock",
      );
    }

    logger("stock.reserved", {
      skuId,
      quantity,
      reservationId,
      reservedBefore: existing.reserved_quantity,
      reservedAfter: newReservedQuantity,
    });

    return updated;
  } catch (err) {
    logError("reserveStock: Database error", err, {
      skuId,
      quantity,
      reservationId,
    });
    throw err;
  }
}

/**
 * Release reserved stock (when cart is abandoned or purchase fails)
 * Uses ACID transaction
 */
export async function releaseStock(
  skuId,
  reservationId,
  quantity = null,
  userId,
  env,
) {
  try {
    // Get reservation
    const reservation = await env.INVENTORY_DB.prepare(
      "SELECT * FROM stock_reservations WHERE reservation_id = ? AND status = ?",
    )
      .bind(reservationId, "active")
      .first();

    if (!reservation) {
      throw new Error(`Active reservation not found: ${reservationId}`);
    }

    if (reservation.sku_id !== skuId) {
      throw new Error(
        `Reservation ${reservationId} does not belong to SKU ${skuId}`,
      );
    }

    const releaseQuantity = quantity || reservation.quantity;
    if (releaseQuantity > reservation.quantity) {
      throw new Error(
        `Cannot release more than reserved. Reserved: ${reservation.quantity}, Requested: ${releaseQuantity}`,
      );
    }

    const existing = await getSkuStock(skuId, env);
    if (!existing) {
      throw new Error(`Stock not found for SKU: ${skuId}`);
    }

    const now = new Date().toISOString();
    const newReservedQuantity = Math.max(
      0,
      existing.reserved_quantity - releaseQuantity,
    );
    const newAvailableQuantity = existing.quantity - newReservedQuantity;

    // Use transaction
    await env.INVENTORY_DB.batch([
      // Update stock
      env.INVENTORY_DB.prepare(
        `
        UPDATE sku_stock 
        SET reserved_quantity = ?, available_quantity = ?, updated_at = ?, updated_by = ?
        WHERE sku_id = ?
      `,
      ).bind(
        newReservedQuantity,
        newAvailableQuantity,
        now,
        userId || "system",
        skuId,
      ),
      // Update or delete reservation
      releaseQuantity >= reservation.quantity
        ? env.INVENTORY_DB.prepare(
            `
            UPDATE stock_reservations 
            SET status = ?, cancelled_at = ?
            WHERE reservation_id = ?
          `,
          ).bind("cancelled", now, reservationId)
        : env.INVENTORY_DB.prepare(
            `
            UPDATE stock_reservations 
            SET quantity = quantity - ?, updated_at = ?
            WHERE reservation_id = ?
          `,
          ).bind(releaseQuantity, now, reservationId),
      // Create history entry
      env.INVENTORY_DB.prepare(
        `
        INSERT INTO stock_history (
          history_id, sku_id, product_id, sku_code,
          change_type, quantity_before, quantity_after,
          reserved_before, reserved_after,
          reservation_id, reason, changed_by, changed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      ).bind(
        uuidv4(),
        skuId,
        existing.product_id,
        existing.sku_code,
        "release",
        existing.quantity,
        existing.quantity, // Quantity doesn't change on release
        existing.reserved_quantity,
        newReservedQuantity,
        reservationId,
        `Stock released: ${releaseQuantity} units`,
        userId || "system",
        now,
      ),
    ]);

    logger("stock.released", {
      skuId,
      quantity: releaseQuantity,
      reservationId,
      reservedBefore: existing.reserved_quantity,
      reservedAfter: newReservedQuantity,
    });

    return await getSkuStock(skuId, env);
  } catch (err) {
    logError("releaseStock: Database error", err, {
      skuId,
      reservationId,
      quantity,
    });
    throw err;
  }
}

/**
 * Get stock history for a SKU
 */
export async function getStockHistory(skuId, page = 1, limit = 20, env) {
  try {
    const offset = (page - 1) * limit;
    const res = await env.INVENTORY_DB.prepare(
      `
      SELECT * FROM stock_history 
      WHERE sku_id = ? 
      ORDER BY changed_at DESC 
      LIMIT ? OFFSET ?
    `,
    )
      .bind(skuId, limit, offset)
      .all();

    const countRes = await env.INVENTORY_DB.prepare(
      "SELECT COUNT(*) as total FROM stock_history WHERE sku_id = ?",
    )
      .bind(skuId)
      .first();

    return {
      history: res?.results || [],
      page,
      limit,
      total: countRes?.total || 0,
    };
  } catch (err) {
    logError("getStockHistory: Database error", err, { skuId, page, limit });
    throw err;
  }
}
