const express = require("express");
const app = express();

const cors = require("cors");
const connectDB = require("./DB/Connections/db.connect");
const { errors } = require("celebrate");


connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json()); // Parse first


app.get("/health", (req, res) => {
  res.send("Server says Heyyyy! :)");
});

app.use(errors());

module.exports = app;
