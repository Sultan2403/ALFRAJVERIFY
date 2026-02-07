const usersCollection = require("../DB/Models/users.model");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;
const hashingRounds = 10;

const registerUser = async (req, res) => {
  try {
    const { password, email, ...data } = req.body;

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res
        .status(403)
        .json({ success: false, message: "Email is already registered" });
    }

    const pwdHash = await bcrypt.hash(password, hashingRounds);

    const createdUser = await usersCollection.create({
      ...data,
      email,
      password: pwdHash,
    });

    // Sanitized user data
    // I'll prob send a generic response initially. And on login send a bit of user info.

    const { password: userPwd, ...userData } = createdUser.toObject();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    const existingUser = await usersCollection.findOne({ email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    console.log(isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: existingUser._id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token });
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
