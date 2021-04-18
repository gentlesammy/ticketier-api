const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const addUser = async (req, res) => {
  //TODO: validate request using express validator
  //get inputs from request
  const { name, company, address, phone, email, password, userip } = req.body;
  try {
    //check if user exist previously
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

module.exports = {
  addUser,
};
