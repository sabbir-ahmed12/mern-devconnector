const Joi = require("joi");

const registrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
  password2: Joi.ref("password"),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().required().label("Password"),
});

module.exports = { registrationSchema, loginSchema };
