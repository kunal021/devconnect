import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/:id", authValidation, getMessages);
router.post("/send/:id", authValidation, sendMessage);
router.delete("/delete/:id", authValidation, deleteMessage);

export default router;
