// handlers/webhookHandlers.js
// Webhook handlers for Inventory Worker
import { logError } from '../utils/logger.js';
import * as inventoryService from '../services/inventoryService.js';

/**
 * POST /webhooks/payment-status - Handle payment status update webhook from Payment Worker
 * Deducts stock when payment is captured
 */
export async function handlePaymentStatusWebhook(request, env) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(
        JSON.stringify({ 
          error: 'validation_error', 
          message: 'Invalid JSON in request body' 
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const { payment_status, order_items, checkout_session_id, payment_id } = body;
    
    if (!payment_status || !order_items || !Array.isArray(order_items)) {
      return new Response(
        JSON.stringify({
          error: 'validation_error',
          message: 'Missing required fields: payment_status, order_items (array)'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Only deduct stock if payment was captured
    if (payment_status === 'captured') {
      const results = [];
      
      for (const item of order_items) {
        if (!item.sku_id || !item.quantity) {
          continue;
        }
        
        try {
          // Deduct stock for this SKU
          const result = await inventoryService.deductStockForOrder(
            item.sku_id,
            item.quantity,
            payment_id || item.order_id || null,
            env
          );
          results.push({
            sku_id: item.sku_id,
            product_id: item.product_id || null,
            success: true,
            quantity_deducted: item.quantity,
            new_available_quantity: result.available_quantity
          });
        } catch (err) {
          logError('handlePaymentStatusWebhook: Failed to deduct stock', err, {
            sku_id: item.sku_id,
            quantity: item.quantity,
            payment_id
          });
          results.push({
            sku_id: item.sku_id,
            product_id: item.product_id || null,
            success: false,
            error: err.message
          });
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Stock deducted for captured payment',
          payment_id,
          payment_status,
          checkout_session_id,
          results
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Payment not captured - no stock deduction needed
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment not captured - no stock deduction',
          payment_id,
          payment_status
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    logError('handlePaymentStatusWebhook: Handler error', err);
    // Always return 200 to prevent webhook retries
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'internal_error', 
        message: err.message 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

