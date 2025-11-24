// utils/validators.js
import Joi from "joi";

// Order ID schema
export const orderIdSchema = Joi.string().min(1).max(100).required();

// Create fulfillment from webhook schema
export const createFulfillmentWebhookSchema = Joi.object({
  checkout_session_id: Joi.string().min(1).max(100).required(),
  payment_id: Joi.string().min(1).max(100).required(),
  user_id: Joi.string().max(100).allow(null).optional(),
  guest_session_id: Joi.string().max(100).allow(null).optional(),
  order_data: Joi.object({
    delivery_address: Joi.object().optional(),
    billing_address: Joi.object().optional(),
    shipping_method: Joi.object().optional(),
    items: Joi.array()
      .items(
        Joi.object({
          sku_id: Joi.string().required(),
          product_id: Joi.string().optional(),
          quantity: Joi.number().integer().min(1).required(),
          unit_price: Joi.number().min(0).required(),
          subtotal: Joi.number().min(0).required(),
        }),
      )
      .required(),
    subtotal: Joi.number().min(0).required(),
    shipping_cost: Joi.number().min(0).required(),
    tax: Joi.number().min(0).required(),
    total: Joi.number().min(0).required(),
    currency: Joi.string().max(10).default("USD"),
    estimated_delivery_date: Joi.string().optional(),
  }).required(),
});

// Update fulfillment status schema
export const updateFulfillmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    )
    .required(),
  notes: Joi.string().max(1000).optional(),
});

// Add shipping tracking schema
export const addShippingTrackingSchema = Joi.object({
  carrier: Joi.string().min(1).max(100).required(),
  tracking_number: Joi.string().min(1).max(200).required(),
  estimated_delivery_date: Joi.string().optional(),
  notes: Joi.string().max(1000).optional(),
});

// Update shipping tracking schema
export const updateShippingTrackingSchema = Joi.object({
  status: Joi.string()
    .valid(
      "pending",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "exception",
    )
    .optional(),
  estimated_delivery_date: Joi.string().optional(),
  actual_delivery_date: Joi.string().optional(),
  notes: Joi.string().max(1000).optional(),
});

// Validation functions
export function validateOrderId(orderId) {
  return orderIdSchema.validate(orderId);
}

export function validateCreateFulfillmentWebhook(data) {
  return createFulfillmentWebhookSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export function validateUpdateFulfillmentStatus(data) {
  return updateFulfillmentStatusSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export function validateAddShippingTracking(data) {
  return addShippingTrackingSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export function validateUpdateShippingTracking(data) {
  return updateShippingTrackingSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
}
