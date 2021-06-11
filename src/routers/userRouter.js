const express = require("express");
const router = express.Router();
const {
  addUser,
  loginUser,
  getUser,
  whatever,
  logOutUser
} = require("../controller/userController");
const { userAuthorization } = require("../middleware/authorization");
const {resetPasswordPost, resetPasswordPatch}  = require("../controller/passwordController");
const {updatePasswordValidation, registerationValidation, loginValidation, resetPasswordValidation} = require("../middleware/formValidation");
//routes for users
router.post("/adduser",registerationValidation, addUser);
router.post("/login", loginValidation, loginUser);
//forget password routes
router.post("/forget_password", resetPasswordValidation, resetPasswordPost);
router.patch("/forget_password", updatePasswordValidation, resetPasswordPatch);
router.get("/user", getUser, userAuthorization);
//logoutUser Route
router.delete("/logout", userAuthorization, logOutUser, );


//test routes
router.get("/whatever", whatever);
router.get("/hello", (req, res) => {
  res.json({ message: "Hello world", from: "api/v1/user/hello" });
});

module.exports = router;
