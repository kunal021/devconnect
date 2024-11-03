const express = require("express");
const userRouter = require("./auth.route.js");

const router = express.Router();

router.use("/auth", userRouter);

module.exports = router;
