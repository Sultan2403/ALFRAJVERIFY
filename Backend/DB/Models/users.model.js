const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    strict: true,
  },
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
