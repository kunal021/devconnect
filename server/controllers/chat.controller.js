import { getReceiverSocketId } from "../index.js";
import Message from "../schemas/message.schema.js";

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

    if (!loggedInUser) {
      throw { status: 401, message: "Unauthorized" };
    }
    if (!receiverId || !text) {
      throw { status: 400, message: "All fields are required" };
    }
    let imageUrl;

    const message = await Message.create({
      senderId: loggedInUser,
      receiverId,
      text,
      image,
    });

    if (!message) {
      throw { status: 500, message: "Failed to send message" };
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};
