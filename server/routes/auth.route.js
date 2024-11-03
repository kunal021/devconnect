const express = require("express");
const {
  login,
  signup,
  googleSignin,
  getUser,
} = require("../controllers/auth.controller.js");
const validateSchema = require("../middlewares/validateSchema.middleware.js");
const { signupSchema, loginSchema } = require("../utils/validation.js");
const authValidation = require("../middlewares/authValidation.middleware.js");

const router = express.Router();

router.post("/login", validateSchema(loginSchema), login);
router.post("/signup", validateSchema(signupSchema), signup);
router.post("/google-signin", googleSignin);
router.get("/profile", authValidation, getUser);

module.exports = router;
