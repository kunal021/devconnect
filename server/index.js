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

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.broadcast.emit("user-connected", { id: socket.id });

  socket.on("message", (data) => {
    console.log(`Messagee from ${socket.id}: ${data}`);
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
