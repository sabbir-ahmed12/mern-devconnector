// Register a new user
const express = require("express");
const router = express.Router();
const validateForm = require("../middlewares/validators/validator");
const { registrationSchema } = require("../middlewares/validators/schemas");
const registerController = require("../controllers/registerController");

router.post(
  "/",
  validateForm(registrationSchema),
  registerController.handleNewUser
);

module.exports = router;
