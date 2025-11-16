import Joi from 'joi'

export const registerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(128).required(),
  // PII fields (optional)
  phoneNumber: Joi.string().max(20).allow(null, ''),
  address: Joi.string().max(500).allow(null, ''),
  dateOfBirth: Joi.string().max(50).allow(null, ''),
  ssn: Joi.string().max(20).allow(null, ''),
  fullName: Joi.string().max(200).allow(null, ''),
});

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

export function validateSignup(body) {
  return registerSchema.validate(body, { abortEarly: false })
}
export function validateLogin(body) {
  return loginSchema.validate(body, { abortEarly: false })
}