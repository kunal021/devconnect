import mongoose from "mongoose";
import Message from "../schemas/message.schema.js";
import { getIO, getReceiverSocketId } from "../socket.js";

export const getMessages = async (req, res, next) => {
  try {
    const { id: userToChatId } = req.params;
    const { _id: loggedInUser } = req.user;
    if (!loggedInUser) {
      throw { status: 401, message: "Unauthorized" };
    }
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUser },
      ],
    });
    if (!messages) {
      throw { status: 404, message: "No messages found" };
    }

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;
    const { _id: loggedInUser } = req.user;
    const { text, image } = req.body;

    if (!loggedInUser || !mongoose.Types.ObjectId.isValid(loggedInUser)) {
      throw { status: 401, message: "Unauthorized or invalid sender ID" };
    }

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      throw { status: 400, message: "Invalid receiver ID" };
    }

    if (!text) {
      throw { status: 400, message: "Message text is required" };
    }

    const message = await Message.create({
      senderId: loggedInUser,
      receiverId,
      text,
      image,
    });

    if (!message) {
      throw { status: 500, message: "Failed to send message" };
    }

    const io = getIO(); // Get the socket instance
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw { status: 400, message: "Invalid message ID" };
    }

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      throw { status: 404, message: "Message not found" };
    }

    return res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};
