import express from "express";
import authValidation from "../middlewares/authValidation.middleware.js";
import { sendConnectionRequest } from "../controllers/connection.controller.js";

const router = express.Router();

router.post("/:status/:userId", authValidation, sendConnectionRequest);

export default router;
