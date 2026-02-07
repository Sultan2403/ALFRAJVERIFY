const usersCollection = require("../DB/Models/users.model");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;
const hashingRounds = 10;
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { password, email, ...data } = req.body;

    const pwdHash = await bcrypt.hash(password, hashingRounds);

    const createdUser = await usersCollection.create({
      ...data,
      email,
      password: pwdHash,
      balance: 0,
    });

    const user = createdUser.toJSON();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(401)
        .json({ success: false, message: "User already registered" });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    const existingUser = await usersCollection
      .findOne({ email })
      .select("+password");

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const pwdsMatch = await bcrypt.compare(password, existingUser.password);

    if (!pwdsMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const user = existingUser.toJSON();

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ success: true, user, token });
  } catch (error) {
    console.error(error, error.message);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await usersCollection.find();

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "An error occured" });
  }
};

module.exports = { registerUser, loginUser, getAllUsers };
