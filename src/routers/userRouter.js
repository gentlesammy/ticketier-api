const express = require("express");
const router = express.Router();
const {
  addUser,
  loginUser,
  getUser,
  whatever,
} = require("../controller/userController");
const { userAuthorization } = require("../middleware/authorization");
const {resetPasswordPost, resetPasswordPatch}  = require("../controller/passwordController");
//routes for users
router.post("/adduser", addUser);
router.post("/login", loginUser);
//forget password routes
router.post("/forget_password", resetPasswordPost);
router.patch("/forget_password", resetPasswordPatch);
router.get("/user", getUser, userAuthorization);

//test routes
router.get("/whatever", whatever);
router.get("/hello", (req, res) => {
  res.json({ message: "Hello world", from: "api/v1/user/hello" });
});

module.exports = router;
