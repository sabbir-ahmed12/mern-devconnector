const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Function to register new user
const handleNewUser = async (req, res) => {
  const { name, email, password } = req.body;
  const duplicate = await User.findOne({ email: email });

  if (duplicate) {
    return res.status(409).json({ message: "Email already exists." });
  }

  try {
    // Creating avatar
    const avatar = gravatar.url(
      email,
      {
        s: "200",
        r: "pg",
        d: "mp",
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
    res.status(201).send(`New account ${name} created.`);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { handleNewUser };
