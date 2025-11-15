import Joi from 'joi'

const signupSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(128).required(),    
})

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
})

export function validateSignup(body) {
  return signupSchema.validate(body, { abortEarly: false })
}
export function validateLogin(body) {
  return loginSchema.validate(body, { abortEarly: false })
}