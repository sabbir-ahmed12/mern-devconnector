const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/User");

// Function to validate user input
const validateRegisterForm = (reqBody) => {
  // Creating Joi schema
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    confirm_password: Joi.ref("password"),
  });

  return schema.validate(reqBody);
};

// Function to register new user
const handleNewUser = async (req, res) => {
  const { error } = validateRegisterForm(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  const duplicate = await User.findOne({ email: email });

  if (duplicate) {
    return res.status(409).json({ email: "Email already exists." });
  }

  try {
    // Creating avatar
    const avatar = gravatar.url(
      email,
      {
        s: "200",
        r: "pg",
        d: "mm",
      },
      false
    );

    // Encrypting the password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create and store new user
    const result = await User.create({
      name: name,
      email: email,
      avatar: avatar,
      password: hashedPwd,
    });
    res.status(201).json({ success: `New account ${name} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
