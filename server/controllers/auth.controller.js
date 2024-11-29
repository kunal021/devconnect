import User from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.createAccessToken();

  const refreshToken = user.createRefreshToken();

  // console.log("refreshToken", refreshToken);

  user.refreshToken = refreshToken;

  await user.save({
    validateBeforeSave: false,
  });

  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

export const login = async (req, res) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      throw new Error("All fields are required");
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

    const loogedInUser = await User.findById(user._id).select(
      "-password -refreshToken -__v"
    );

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        message: "User authenticated successfully",
        user: loogedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signup = async (req, res) => {
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
      profession,
    } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });

    if (existingUser) {
      return res.status(400).json({ error: "User Already Exists" });
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
      profession,
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    );

    return res
      .status(200)
      .clearCookie("refreshToken", cookieOptions)
      .clearCookie("accessToken", cookieOptions)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// export const googleSignin = async (req, res) => {
//   const { token } = req.body;
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(token);
//     const { uid, email, name, picture } = decodedToken;

//     let user = await User.findOne({ firebaseUid: uid });

//     if (!user) {
//       user = await User.create({
//         firebaseUid: uid,
//         email,
//         userName: `${name}${Math.floor(Math.random() * 10000)}`,
//         profilePic: picture,
//         provider: decodedToken.firebase.sign_in_provider,
//       });
//     }
//     const token = user.createToken();

//     res.cookie("token", token, {
//       httpOnly: true,
//     });
//     res.status(200).json({ message: "User authenticated" });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token", error: error.message });
//   }
// };

export const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    // console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
      throw new Error("Invalid refresh token");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("Invalid refresh token");
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new Error("Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

export const googleSignin = async (req, res) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
};

export const googleCallback = async (req, res) => {
  passport.authenticate("google", { session: false }, async (req, res) => {
    try {
      const {
        profile,
        accessToken: googleAccessToken,
        refreshToken: googleRefreshToken,
      } = req.user;
      let user = await User.findOne({
        email: profile.emails[0].value,
      });
      if (!user) {
        user = new User({
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          userName: profile.displayName,
          email: profile.emails[0].value,
          providerId: profile.id,
        });
      }

      const loogedInUser = await User.findById(user._id).select(
        "-password -refreshToken -__v"
      );

      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      return res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json({
          message: "User authenticated successfully",
          user: loogedInUser,
          accessToken,
          refreshToken,
        });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
};
