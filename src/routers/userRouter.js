const express = require("express");
const router = express.Router();
const {
  addUser,
  loginUser,
  getUser,
  whatever,
} = require("../controller/userController");
const { userAuthorization } = require("../middleware/authorization");

//routes for users
router.post("/adduser", addUser);
router.post("/login", loginUser);
router.use(userAuthorization);
router.get("/user", getUser, userAuthorization);
router.get("/whatever", whatever);
router.get("/hello", (req, res) => {
  res.json({ message: "Hello world", from: "api/v1/user/hello" });
});

module.exports = router;
