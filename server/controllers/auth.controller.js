const User = require("../schemas/user.schema.js");
const admin = require("firebase-admin");

const login = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { userName: loginIdentifier }],
    });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    }

    const token = user.createToken();

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({ message: "User authenticated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      age,
      gender,
      location,
      bio,
      skills,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("Invalid Credentials");
    }

    const newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password,
      age,
      gender,
      location,
      bio,
      skills,
    });

    res.status(200).json({ message: "User created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const googleSignin = async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        userName: `${name}${Math.floor(Math.random() * 10000)}`,
        profilePic: picture,
        provider: decodedToken.firebase.sign_in_provider,
      });
    }
    const token = user.createToken();

    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(200).json({ message: "User authenticated" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  login,
  signup,
  googleSignin,
  getUser,
};
