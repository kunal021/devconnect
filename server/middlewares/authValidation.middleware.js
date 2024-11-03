const User = require("../schemas/user.schema.js");
const jwt = require("jsonwebtoken");

const authValidation = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Unauthorized");
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedToken;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = authValidation;
