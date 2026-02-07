const { celebrate } = require("celebrate");
const express = require("express");
const {registerSchema, loginSchema} = require("../Schemas/users.schema");
const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../Controllers/users.controller");
const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", celebrate({ body: registerSchema }), registerUser);
router.post("/login", celebrate({ body: loginSchema }), loginUser);

module.exports = router;
