const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const requestIp = require("request-ip");
const addUser = async (req, res) => {
  //TODO: validate request using express validator
  //get inputs from request
  const clientIp = requestIp.getClientIp(req);
  req.body.userip = clientIp;
  const { name, company, address, phone, email, password, userip } = req.body;
  try {
    //check if user exist previously 3143958829
    let user = await User.findOne({
      email,
    });
    //user exist
    if (user) {
      return res.status(400).json({
        status: "error",
        data: { message: "User Already Exists" },
      });
    }

    //user does not exist so create one
    user = new User({ name, company, address, phone, email, password, userip });
    //TODO: install bcrypt  and salt the password

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return res.status(200).json({
      status: "success",
      data: { message: "user added successfully", data: user },
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      data: error.message,
    });
  }
};
const { createAccessToken, createRefreshToken } = require("../utils/jwt");
const loginUser = async (req, res) => {
  //TODO: check for validation error using express validator

  try {
    //check if email exist
    const correctUser = await User.findOne({ email: req.body.email });
    if (correctUser === null) {
      return res.status(400).send({
        status: "error",
        data: { message: "Invalid login credentials" },
      });
    }

    const { email, password } = correctUser;
    let isMatch = await bcrypt.compareSync(req.body.password, password);
    if (!isMatch) {
      return res.status(400).send({
        status: "error",
        data: { message: "Invalid login credentials" },
      });
    }
    //login credientials are correct, generate access token and refresh token
    const payload = {
      email: correctUser.email,
      id: correctUser._id,
    };

    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    res.json({
      status: "success",
      data: { correctUser, accessToken, refreshToken },
    });
  } catch (error) {
    res.status(400).send({
      status: "error",
      data: { message: error.message },
    });
  }
};

const storeUserRefreshToken = async (id, token) => {
  let _id = id;
  try {
    const data = await User.findOneAndUpdate(
      { _id },
      {
        $set: {
          "refreshJWT.token": token,
          "refreshJWT.addedAt": Date.now(),
        },
      },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }
};

//get user by Id
const getUser = async (req, res) => {
  //extract user id str.replace(/"/g,""
  const _id = mongoose.Types.ObjectId(req.userId.replace(/"/g, "").replace(/\\/g, ''));
  // extract user profile based on user_id
  const userProfile = await User.findById({ _id });
  res.status(200).json({ status: "success", data: userProfile });
};

const whatever = async (req, res) => {
  res.status(200).json({ status: "success", message: "hello" });
};

// get user by email
const getuserByEmail = async (email) => {
  const user = await User.findOne({ email: email });
  // console.log("user re from user controller", user);
  if (user != null) {
    return user;
  }
};

module.exports = {
  addUser,
  loginUser,
  storeUserRefreshToken,
  getUser,
  whatever,
  getuserByEmail,
};
