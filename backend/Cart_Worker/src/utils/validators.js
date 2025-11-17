// utils/validators.js
import Joi from 'joi';

// Add Item to Cart schema
export const addItemSchema = Joi.object({
  sku_id: Joi.string().min(1).max(100).required(),
  quantity: Joi.number().integer().min(1).max(999).required(),
});

// Update Item Quantity schema
export const updateQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(0).max(999).required(), // 0 means remove item
});

// Cart ID schema
export const cartIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'Cart ID is required',
    'any.required': 'Cart ID is required'
  });

// Item ID schema
export const itemIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'Item ID is required',
    'any.required': 'Item ID is required'
  });

// SKU ID schema
export const skuIdSchema = Joi.string().min(1).max(100).required()
  .messages({
    'string.empty': 'SKU ID is required',
    'any.required': 'SKU ID is required'
  });

// Validation functions
export function validateAddItem(data) {
  return addItemSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateUpdateQuantity(data) {
  return updateQuantitySchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateCartId(cartId) {
  return cartIdSchema.validate(cartId);
}

export function validateItemId(itemId) {
  return itemIdSchema.validate(itemId);
}

export function validateSkuId(skuId) {
  return skuIdSchema.validate(skuId);
}

