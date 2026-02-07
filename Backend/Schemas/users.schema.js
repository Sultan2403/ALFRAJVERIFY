const { Joi } = require("celebrate");

const name = Joi.string()
  .trim()
  .min(3)
  .max(100)
  .pattern(/^[\p{L}\p{M}\d'’\.\-\s]+$/u)
  .messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.pattern.base": "Name contains invalid characters",
  })
  .required();

const email = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .messages({
    "string.email": "Email must be a valid email address",
    "string.empty": "Email cannot be empty",
  })
  .required();

const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 128 characters",
    "string.pattern.base":
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  .required();

const registerSchema = Joi.object({
  name: name,
  email: email,
  password: password,
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Confirm password is required",
  }),
})
  .required()
  .options({ stripUnknown: true });

const loginSchema = Joi.object({
  email: email,
  password: password,
})
  .required()
  .options({ stripUnknown: true });

module.exports = { registerSchema, loginSchema };
