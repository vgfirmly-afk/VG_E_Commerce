// utils/validators.js
import Joi from 'joi';

// Create payment intent schema
export const createPaymentSchema = Joi.object({
  checkout_session_id: Joi.string().min(1).max(100).required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default('USD'),
  intent: Joi.string().valid('CAPTURE', 'AUTHORIZE').default('CAPTURE'),
  return_url: Joi.string().uri().required(),
  cancel_url: Joi.string().uri().required(),
  description: Joi.string().max(500).optional(),
  metadata: Joi.object().optional(),
});

// Payment ID schema
export const paymentIdSchema = Joi.string().min(1).max(100).required();

// Capture payment schema
export const capturePaymentSchema = Joi.object({
  order_id: Joi.string().min(1).max(100).optional(), // PayPal order ID if not in payment record
});

// Validation functions
export function validateCreatePayment(data) {
  return createPaymentSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

export function validatePaymentId(paymentId) {
  return paymentIdSchema.validate(paymentId);
}

export function validateCapturePayment(data) {
  return capturePaymentSchema.validate(data, { abortEarly: false, stripUnknown: true });
}

