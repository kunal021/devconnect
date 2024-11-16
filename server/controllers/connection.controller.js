import Connection from "../schemas/connection.schema.js";
import User from "../schemas/user.schema.js";

export const sendConnectionRequest = async (req, res) => {
  const { _id: senderId } = req.user;
  const receiverId = req.params.userId;
  const status = req.params.status;

  const allowedStatus = ["interested", "ignored"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    if (senderId === receiverId) {
      return res
        .status(400)
        .json({ message: "You cannot connect with yourself" });
    }

    const senderUser = await User.findById(senderId);

    if (!senderUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const receiverUser = await User.findById(receiverId);

    if (!receiverUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConnection = await Connection.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .json({ message: "Connection request already exists" });
    }

    const data = await Connection.create({
      sender: senderId,
      receiver: receiverId,
      status: status,
    });

    return res
      .status(200)
      .json({
        message:
          status === "interested"
            ? `${req.user.userName} is interested in ${receiverUser.userName}`
            : `${req.user.userName} has ignored ${receiverUser.userName}`,
        data,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
