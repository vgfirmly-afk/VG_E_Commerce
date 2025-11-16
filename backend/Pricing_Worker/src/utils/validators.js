// utils/validators.js
import Joi from 'joi';

// SKU Price schema
export const skuPriceSchema = Joi.object({
  sku_id: Joi.string().min(1).max(100).required(),
  product_id: Joi.string().min(1).max(100).required(),
  sku_code: Joi.string().min(1).max(100).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().length(3).default('USD'),
  sale_price: Joi.number().min(0).allow(null),
  compare_at_price: Joi.number().min(0).allow(null),
  cost_price: Joi.number().min(0).allow(null),
  status: Joi.string().valid('active', 'inactive').default('active'),
  valid_from: Joi.string().isoDate().default(() => new Date().toISOString()),
  valid_to: Joi.string().isoDate().allow(null),
});

// SKU Price Update schema (all fields optional except sku_id)
export const skuPriceUpdateSchema = Joi.object({
  price: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).optional(),
  sale_price: Joi.number().min(0).allow(null).optional(),
  compare_at_price: Joi.number().min(0).allow(null).optional(),
  cost_price: Joi.number().min(0).allow(null).optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  valid_from: Joi.string().isoDate().optional(),
  valid_to: Joi.string().isoDate().allow(null).optional(),
  reason: Joi.string().max(500).allow(null, '').optional(), // Reason for price change
});

// Calculate Total schema - accepts array of SKU IDs with quantities
export const calculateTotalSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      sku_id: Joi.string().min(1).max(100).required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  promotion_code: Joi.string().max(50).allow(null, '').optional(),
  currency: Joi.string().length(3).default('USD').optional(),
});

// Price History Query schema
export const priceHistoryQuerySchema = Joi.object({
  sku_id: Joi.string().min(1).max(100).required(),
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

// URL path parameter schemas
export const skuIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'SKU ID is required',
    'any.required': 'SKU ID is required'
  });

export const promotionCodeSchema = Joi.string().min(1).max(50).required()
  .messages({
    'string.empty': 'Promotion code is required',
    'any.required': 'Promotion code is required'
  });

// Validation functions
export function validateSkuPrice(data) {
  return skuPriceSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSkuPriceUpdate(data) {
  const result = skuPriceUpdateSchema.validate(data, { 
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

export function validateCalculateTotal(data) {
  return calculateTotalSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validatePriceHistoryQuery(params) {
  return priceHistoryQuerySchema.validate(params, { abortEarly: false, stripUnknown: true });
}

export function validateSkuId(skuId) {
  return skuIdSchema.validate(skuId);
}

export function validatePromotionCode(code) {
  return promotionCodeSchema.validate(code);
}

