const { celebrate } = require("celebrate");
const express = require("express");
const userSchema = require("../Schemas/users.schema");
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../Controllers/users.controller");
const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", celebrate({ body: userSchema }), registerUser);
router.post("/login", celebrate({ body: userSchema }), loginUser);

module.exports = router;
