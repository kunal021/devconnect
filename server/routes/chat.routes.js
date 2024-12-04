import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import { getMessages, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:id", authValidation, getMessages);
router.post("/send/:id", authValidation, sendMessage);

export default router;
