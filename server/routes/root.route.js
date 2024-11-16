import express from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import connectionRouter from "./connection.route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/connection", connectionRouter);

export default router;
