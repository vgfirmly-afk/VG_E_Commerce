// utils/validators.js
import Joi from 'joi';

// Address schema
export const addressSchema = Joi.object({
  full_name: Joi.string().min(1).max(200).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().optional(),
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

