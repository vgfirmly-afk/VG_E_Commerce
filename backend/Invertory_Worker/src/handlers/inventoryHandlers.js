// handlers/inventoryHandlers.js
import { logError } from "../utils/logger.js";
import { validateSkuId } from "../utils/validators.js";
import * as inventoryService from "../services/inventoryService.js";

/**
 * GET /stock/:sku_id - Get stock for a single SKU
 */
export async function getStock(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const stock = await inventoryService.getStock(skuId, env);

    if (!stock) {
      return new Response(
        JSON.stringify({
          error: "not_found",
          message: `Stock not found for SKU: ${skuId}`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify(stock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("getStock: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST /stock/:sku_id - Initialize stock for a new SKU (admin/service only)
 */
export async function initializeStock(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await request.json();

    // Get user from request (set by adminAuth middleware or service)
    const userId = request.user?.userId || "system";

    // Build stock data
    const stockData = {
      sku_id: skuId,
      product_id: body.product_id || "",
      sku_code: body.sku_code || "",
      quantity: body.quantity !== undefined ? body.quantity : 0,
      low_stock_threshold: body.low_stock_threshold || null,
      reason: body.reason || "Stock initialized from Catalog Worker",
    };

    const stock = await inventoryService.initializeStock(stockData, env);

    return new Response(JSON.stringify(stock), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("initializeStock: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * PUT /stock/:sku_id - Update stock (admin only)
 */
export async function updateStock(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await request.json();
    const userId = request.user?.userId || "admin";

    const stock = await inventoryService.updateStock(skuId, body, userId, env);

    return new Response(JSON.stringify(stock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("updateStock: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST /stock/:sku_id/adjust - Adjust stock quantity (admin only)
 */
export async function adjustStock(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await request.json();
    const userId = request.user?.userId || "admin";

    const { quantity, reason, reservation_id } = body;
    if (quantity === undefined || quantity === null) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Quantity is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const stock = await inventoryService.adjustStock(
      skuId,
      quantity,
      userId,
      env,
      reason,
      reservation_id,
    );

    return new Response(JSON.stringify(stock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("adjustStock: Handler error", err);
    const status = err.message.includes("Insufficient") ? 400 : 500;
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST /stock/:sku_id/reserve - Reserve stock (for cart/checkout)
 */
export async function reserveStock(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await request.json();
    const userId = request.user?.userId || "user";

    const { quantity, reservation_id, expires_at } = body;
    if (!quantity || !reservation_id) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Quantity and reservation_id are required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const stock = await inventoryService.reserveStockForCart(
      skuId,
      quantity,
      reservation_id,
      userId,
      env,
      expires_at,
    );

    return new Response(JSON.stringify(stock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("reserveStock: Handler error", err);
    const status = err.message.includes("Insufficient") ? 400 : 500;
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST /stock/:sku_id/release - Release reserved stock
 */
export async function releaseStock(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const body = await request.json();
    const userId = request.user?.userId || "user";

    const { reservation_id, quantity } = body;
    if (!reservation_id) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "reservation_id is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const stock = await inventoryService.releaseReservedStock(
      skuId,
      reservation_id,
      quantity,
      userId,
      env,
    );

    return new Response(JSON.stringify(stock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("releaseStock: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * GET /stock/:sku_id/history - Get stock history
 */
export async function getHistory(request, env) {
  try {
    const skuId = request.params?.sku_id;

    // Validate SKU ID
    const { error: idError } = validateSkuId(skuId);
    if (idError) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: idError.details?.[0]?.message || "Invalid SKU ID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const history = await inventoryService.getHistory(skuId, page, limit, env);

    return new Response(JSON.stringify(history), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("getHistory: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * GET /stock/product/:product_id - Get all stock for a product
 */
export async function getProductStock(request, env) {
  try {
    const productId = request.params?.product_id;

    if (!productId) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "Product ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const stocks = await inventoryService.getProductStocks(productId, env);

    return new Response(JSON.stringify({ product_id: productId, stocks }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("getProductStock: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

/**
 * POST /stock/check - Check stock availability for multiple SKUs
 */
export async function checkAvailability(request, env) {
  try {
    const body = await request.json();
    const { sku_ids } = body;

    if (!sku_ids || !Array.isArray(sku_ids) || sku_ids.length === 0) {
      return new Response(
        JSON.stringify({
          error: "validation_error",
          message: "sku_ids array is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const availability = await inventoryService.checkAvailability(sku_ids, env);

    return new Response(JSON.stringify({ availability }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logError("checkAvailability: Handler error", err);
    return new Response(
      JSON.stringify({ error: "internal_error", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
