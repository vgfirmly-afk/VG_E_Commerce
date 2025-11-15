import Joi from 'joi'

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(10).max(128).required(),
  name: Joi.string().min(1).max(100).optional()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

export function validateSignup(body) {
  return signupSchema.validate(body, { abortEarly: false })
}
export function validateLogin(body) {
  return loginSchema.validate(body, { abortEarly: false })
}