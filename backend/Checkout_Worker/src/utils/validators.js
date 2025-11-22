// utils/validators.js
import Joi from 'joi';

// Address schema
export const addressSchema = Joi.object({
  full_name: Joi.string().min(1).max(200).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email({ tlds: { allow: false } }).optional(), // Disable TLD validation to avoid nodejs_compat issues
  address_line1: Joi.string().min(1).max(500).required(),
  address_line2: Joi.string().max(500).optional(),
  city: Joi.string().min(1).max(100).required(),
  state: Joi.string().min(1).max(100).required(),
  postal_code: Joi.string().min(5).max(10).required(),
  country: Joi.string().length(2).default('IN'),
  is_default: Joi.boolean().default(false),
});

// Set delivery address schema
export const setDeliveryAddressSchema = addressSchema.keys({
  use_for_billing: Joi.boolean().default(false),
});

// Set billing address schema
export const setBillingAddressSchema = addressSchema;

// Select shipping method schema
export const selectShippingMethodSchema = Joi.object({
  shipping_method_id: Joi.string().min(1).max(100).required(),
});

// Create checkout session schema
export const createCheckoutSessionSchema = Joi.object({
  cart_id: Joi.string().min(1).max(100).required(),
});

// Validation functions
export function validateAddress(data) {
  return addressSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSetDeliveryAddress(data) {
  return setDeliveryAddressSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSetBillingAddress(data) {
  return setBillingAddressSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSelectShippingMethod(data) {
  return selectShippingMethodSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateCreateCheckoutSession(data) {
  return createCheckoutSessionSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateSessionId(sessionId) {
  return Joi.string().min(1).max(100).required().validate(sessionId);
}

export function validateCartId(cartId) {
  return Joi.string().min(1).max(100).required().validate(cartId);
}

// Shipping method schemas (admin)
export const shippingMethodSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  description: Joi.string().max(500).optional(),
  carrier: Joi.string().min(1).max(100).required(),
  base_cost: Joi.number().min(0).default(0.00),
  cost_per_kg: Joi.number().min(0).default(0.00),
  min_delivery_days: Joi.number().integer().min(1).max(30).default(3),
  max_delivery_days: Joi.number().integer().min(1).max(30).default(7),
  is_active: Joi.boolean().default(true),
  applicable_pincodes: Joi.array().items(Joi.string()).optional(), // Array of pincodes or ['*'] for all
});

export const shippingMethodUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  description: Joi.string().max(500).allow(null).optional(),
  carrier: Joi.string().min(1).max(100).optional(),
  base_cost: Joi.number().min(0).optional(),
  cost_per_kg: Joi.number().min(0).optional(),
  min_delivery_days: Joi.number().integer().min(1).max(30).optional(),
  max_delivery_days: Joi.number().integer().min(1).max(30).optional(),
  is_active: Joi.boolean().optional(),
  applicable_pincodes: Joi.array().items(Joi.string()).allow(null).optional(),
});

export const shippingMethodIdSchema = Joi.string().min(1).max(100).required();

// Validation functions for shipping methods
export function validateShippingMethod(data) {
  return shippingMethodSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateShippingMethodUpdate(data) {
  return shippingMethodUpdateSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validateShippingMethodId(methodId) {
  return shippingMethodIdSchema.validate(methodId);
}

