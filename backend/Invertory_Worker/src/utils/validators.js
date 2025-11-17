// utils/validators.js
import Joi from 'joi';

// SKU Stock schema
export const skuStockSchema = Joi.object({
  sku_id: Joi.string().min(1).max(100).required(),
  product_id: Joi.string().min(1).max(100).required(),
  sku_code: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().integer().min(0).required(),
  reserved_quantity: Joi.number().integer().min(0).default(0),
  available_quantity: Joi.number().integer().min(0).default(0),
  low_stock_threshold: Joi.number().integer().min(0).allow(null).optional(),
  status: Joi.string().valid('active', 'inactive', 'out_of_stock').default('active'),
});

// SKU Stock Update schema (all fields optional except sku_id)
export const skuStockUpdateSchema = Joi.object({
  quantity: Joi.number().integer().min(0).optional(),
  reserved_quantity: Joi.number().integer().min(0).optional(),
  low_stock_threshold: Joi.number().integer().min(0).allow(null).optional(),
  status: Joi.string().valid('active', 'inactive', 'out_of_stock').optional(),
  reason: Joi.string().max(500).allow(null, '').optional(), // Reason for stock change
});

// Stock Adjustment schema (for increase/decrease operations)
export const stockAdjustmentSchema = Joi.object({
  quantity: Joi.number().integer().required(), // Positive for increase, negative for decrease
  reason: Joi.string().max(500).allow(null, '').optional(),
  reservation_id: Joi.string().max(100).allow(null, '').optional(), // For tracking reservations
});

// Reserve Stock schema (for reserving stock before purchase)
export const reserveStockSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  reservation_id: Joi.string().min(1).max(100).required(), // Unique reservation ID
  expires_at: Joi.string().isoDate().optional(), // When reservation expires
});

// Release Stock schema (for releasing reserved stock)
export const releaseStockSchema = Joi.object({
  reservation_id: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().integer().min(1).optional(), // Optional: release specific quantity, otherwise release all
});

// Check Stock Availability schema
export const checkStockSchema = Joi.object({
  sku_ids: Joi.array().items(Joi.string().min(1).max(100)).min(1).required(),
});

// URL path parameter schemas
export const skuIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'SKU ID is required',
    'any.required': 'SKU ID is required'
  });

// Validation functions
export function validateSkuStock(data) {
  return skuStockSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSkuStockUpdate(data) {
  const result = skuStockUpdateSchema.validate(data, { 
    abortEarly: false, 
    stripUnknown: true,
    allowUnknown: false
  });
  
  // If there are errors, filter out "required" errors since all fields are optional for updates
  if (result.error) {
    const filteredErrors = result.error.details.filter(detail => detail.type !== 'any.required');
    if (filteredErrors.length > 0) {
      return {
        error: {
          ...result.error,
          details: filteredErrors
        },
        value: result.value
      };
    }
    return { error: null, value: result.value };
  }
  
  return result;
}

export function validateStockAdjustment(data) {
  return stockAdjustmentSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateReserveStock(data) {
  return reserveStockSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateReleaseStock(data) {
  return releaseStockSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateCheckStock(data) {
  return checkStockSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSkuId(skuId) {
  return skuIdSchema.validate(skuId);
}

