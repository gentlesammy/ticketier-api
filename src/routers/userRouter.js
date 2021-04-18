const express = require("express");
const router = express.Router();
const { addUser } = require("../controller/userController");

//routes for users
router.post("/adduser", addUser);
router.get("/hello", (req, res) => {
  res.json({ message: "Hello world", from: "api/v1/user/hello" });
});

module.exports = router;
