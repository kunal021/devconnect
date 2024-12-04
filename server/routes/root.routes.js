import express from "express";
import authRouter from "./auth.routes.js";
import userRouter from "./user.routes.js";
import connectionRouter from "./connection.routes.js";
import postRouter from "./post.routes.js";
import chatRouter from "./chat.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/connection", connectionRouter);
router.use("/post", postRouter);
router.use("/chat", chatRouter);

export default router;
