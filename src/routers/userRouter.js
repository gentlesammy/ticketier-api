const express = require("express");
const router = express.Router();

//routes for users
router.get("/hello", (req, res) => {
  res.json({ message: "Hello world", from: "api/v1/user/hello" });
});

module.exports = router;
