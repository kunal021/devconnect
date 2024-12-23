import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/DBConnect.js";
import rootRoute from "./routes/root.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { object } from "zod";

const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://devconnectt.pages.dev"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://devconnectt.pages.dev"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1", rootRoute);
app.use(errorHandler);

connectDB()
  .then(() => {
    console.log("Connected to Database");
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap = {};
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
