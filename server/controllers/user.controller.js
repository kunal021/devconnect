import Connection from "../schemas/connection.schema.js";
import User from "../schemas/user.schema.js";

export const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken -__v");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(
      "-password -refreshToken -__v"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const {
      firstName,
      lastName,
      userName,
      age,
      gender,
      location,
      bio,
      skills,
    } = req.body;

    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findOne({ userName });

    if (user._id.toString() !== _id.toString()) {
      return res.status(404).json({ message: "UserName not available" });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      userName,
      age,
      gender,
      location,
      bio,
      skills,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkUserNameExists = async (req, res) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "UserName not available" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkUserExists = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User already exists" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { _id } = req.user;
    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password" });
    }

    const user = await User.findById(_id);

    const isPasswordValid = await user.validatePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid current password" });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllConnectionRequests = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connectionRequests = await Connection.find({
      receiver: loggedInUser._id,
      status: "interested",
    }).populate("sender", [
      "firstName",
      "lastName",
      "age",
      "gender",
      "bio",
      "profilePic",
      "skills",
    ]);

    if (!connectionRequests || connectionRequests.length === 0) {
      return res.status(404).json({ message: "No connection requests found" });
    }

    return res.status(200).json({ connectionRequests });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllConnections = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connections = await Connection.find({
      $or: [
        { sender: loggedInUser._id, status: "accepted" },
        { receiver: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("sender", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "profilePic",
        "skills",
      ])
      .populate("receiver", [
        "firstName",
        "lastName",
        "age",
        "gender",
        "bio",
        "profilePic",
        "skills",
      ]);

    if (!connections || connections.length === 0) {
      return res.status(404).json({ message: "No connections found" });
    }

    const data = connections.map((connection) => {
      if (connection.sender._id.toString() === loggedInUser._id.toString()) {
        return connection.receiver;
      } else {
        return connection.sender;
      }
    });

    return res.status(200).json({ connections: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const maxLimit = limit > 50 ? 50 : limit;

    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const connectionRequests = await Connection.find({
      $or: [{ receiver: loggedInUser._id }, { sender: loggedInUser._id }],
    });

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((connection) => {
      hideUsersFromFeed.add(connection.sender._id.toString());
      hideUsersFromFeed.add(connection.receiver._id.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: [...hideUsersFromFeed] } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("-password -refreshToken -__v")
      .skip(skip)
      .limit(maxLimit);

    if (!feed || feed.length === 0) {
      return res.status(404).json({ message: "No feed found" });
    }

    return res.status(200).json({ data: feed });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
