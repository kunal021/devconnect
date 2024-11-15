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
      email,
      age,
      gender,
      location,
      bio,
      skills,
    } = req.body;

    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      userName,
      email,
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
      return res.status(404).json({ message: "UserName not found" });
    }

    return res.status(200).json({ message: "UserName already exists" });
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
  const { currentPassword, newPassword } = req.body;
  const { _id } = req.user;
  try {
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
      return res.status(400).json({ message: "Invalid password" });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
