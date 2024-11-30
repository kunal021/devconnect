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
  httpOnly: true, // Ensures cookies are not accessible via JavaScript
  secure: process.env.NODE_ENV === "production", // Set `true` in production to use HTTPS
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // For cross-site cookies in production
};

export const login = async (req, res, next) => {
  try {
    const { loginIdentifier, password } = req.body;

    if (!loginIdentifier || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier }, { userName: loginIdentifier }],
    });

    if (!user) {
      throw { status: 404, message: "Invalid Credentials" };
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      throw { status: 404, message: "Invalid Credentials" };
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
        success: true,
        message: "User authenticated successfully",
        user: loogedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
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
      throw { status: 400, message: "User already exists" };
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

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
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
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    next(error);
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

export const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    // console.log(incomingRefreshToken);

    if (!incomingRefreshToken) {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw { status: 401, message: "Unauthorized" };
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw { status: 401, message: "Invalid refresh token" };
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken,
        refreshToken,
      });
  } catch (error) {
    next(error);
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
