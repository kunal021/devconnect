const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 56,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 56,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 56,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 56,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // Allows `firebaseUid` to be null for non-Firebase users
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 250,
      default: "Tell us about yourself",
    },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    skills: {
      type: [String],
      max: 10,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.validatePassword = function (hashedPassword) {
  return bcrypt.compare(hashedPassword, this.password);
};

userSchema.methods.createToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
