import express from "express";
import {
  login,
  signup,
  googleSignin,
  logout,
  refreshAccessToken,
  googleCallback,
} from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";
import { signupSchema, loginSchema } from "../utils/validation.js";
import authValidation from "../middlewares/authValidation.middleware.js";
import { checkUserNameExists } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", validateSchema(loginSchema), login);
router.post("/signup", validateSchema(signupSchema), signup);
router.post("/logout", authValidation, logout);
router.post("/google", googleSignin);
router.post("/google/callback", googleCallback);
router.get("/refresh", authValidation, refreshAccessToken);
router.post("/username-exists", checkUserNameExists);

export default router;
