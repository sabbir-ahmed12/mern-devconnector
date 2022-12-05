const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const validateLoginForm = (reqBody) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(reqBody);
};

const handleUserLogin = async (req, res) => {
  const { error } = validateLoginForm(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).exec();
  if (!user) return res.status(404).json({ email: "User not found" });

  // Check password
  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ password: "Password incorrect." });

  // If password matches
  const payload = {
    name: user.name,
    email: user.email,
  };
  // Sign Token
  const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  res.status(200).json({ success: true, token: "Bearer " + accessToken });
};

module.exports = { handleUserLogin };
