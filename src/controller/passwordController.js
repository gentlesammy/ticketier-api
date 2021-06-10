const mongoose = require("mongoose");
const User = require("../models/userModel");
const PasswordReset = require("../models/passwordResetModel");
const bcrypt = require("bcrypt");
const requestIp = require("request-ip");
const { getuserByEmail } = require("./userController");
const { emailProcessor } = require("../utils/emailHelper");


/*
    FORGET PASSWORD & PASSWORD RESET
*/
//reset password:POST
const resetPasswordPost = async(req, res) => {
    try {
          //steps to take 
          const clientIp = requestIp.getClientIp(req);
          // 1. receive email to reset pin in req.body
          const {email} = req.body;
          if(!email || email == null || email == undefined) {
            return res.status(403).json({status: "error", error: "email is required"})
          }
          // 2. check if user exist for the email
          const userExist = await getuserByEmail(email);
          if(!userExist || userExist == null || userExist == undefined) {
            // if it does not exist
            return res.status(200).json({status: "success", message: "Your reset password has been sent to the email you provided, ode"})
          }
          // 3. create unique six digit pin
            //create pin
            var reqPin = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);
            const restObj = {
              pin: reqPin,
              email,
              userip : clientIp
            }
          // 4. save pin and email in db
          const saveUserPin = await new PasswordReset(restObj);
          const savedPin = await saveUserPin.save();
          if(savedPin){
          // 5. email the pin to the user
          const emailData = {
            email, 
            subject:`Requested Password Reset for pin`,
            text : `You received this email because you requested for
            password change pin via ip ${clientIp}. Your Password Reset Pin
            is ${restObj.pin}
            `,
            html : `
                <h3>Password Reset Pin  </h3>
                <br/>
                <p>
                You received this email because you requested for
                password change pin via ip ${clientIp}. Your Password Reset Pin
                is ${restObj.pin}
                </p>
            `
          }
          const result = await emailProcessor(emailData);
        
          
          if(result?.messageId){
            return res.status(200).json({status: "success", message: "Your reset password has been sent to the email you provided"})
          }

          return res.status(201).json({status: "success", message: "Unable to process your request now. Please try again later"})
        }
    } catch (error) {
      console.log("error from forget password", error.message)
    }
  }
  
  //reset password:PATCH
  const resetPasswordPatch = async(req, res) => {
    const clientIp = requestIp.getClientIp(req);
    req.body.clientIp = clientIp;
    //steps to take
    // 1. receive email, pin and password
    const {email, pin, password } = req.body;
    try {
        // 2. validate pin
      const user = await PasswordReset.findOne({pin, email});
      if(user.email){
        //check if current Ip is the same as old
        if(user.userip != clientIp){
          return res.status(403).json(
            {status: "error", message: "Kindly use the same device you used in requesting the pin"});
        }
        // check if code is still active
        const dbDate = new Date(user.addedAt);
        const expiresIn = 1;
        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
        const today = new Date();

        if(today > expDate){
          return res.status(403).json(
            {status: "error", message: "Your pin has expired"});
        }

        // 3. encrypt new password and save in db
        const salt = await bcrypt.genSalt(10);
        let newPassword = await bcrypt.hash(password, salt);
        // await user.save();
        const uPdatePassword =await User.findOneAndUpdate({email: user.email}, {password: newPassword})
        if(uPdatePassword){
          // 4. send email notification
          const deleteUsedPin = await deletePin(pin);
          const emailData = {
            email, 
            subject:`Password Reset Successfully`,
            text : `You Just reset your password successfully via ip ${clientIp}. 
            `,
            html : `
                <h3>Password Reset Successful  </h3>
                <br/>
                <p>
                You Just reset your password successfully via ip ${clientIp}. 
                </p>
            `
          }
          const result = await emailProcessor(emailData);
          console.log("resulktette", result);
          return res.status(201).json({status: "success", message: "You have updated your password successfully"});
        } 
      }
      //user has not requested for valid password change or code or email not correct
      return res.status(403).json({status: "error", message: "Invalid Request"});
    } catch (error) {
      return res.status(403).json({status: "error", message: "Invalid Request"});
    }
           
  }

  /*
    I extracted some of the methods out of the project 
  */

    //delete pin from database after it has been used for password change
    const deletePin = async(pin) => {
      try {
        const deletedPin = await PasswordReset.findOneAndDelete({pin});
        if(deletedPin){
          return true
        }else{
          return false
        }
        
      } catch (error) {
        console.log("pinDeleteerror", error)
      }
   
    }





  module.exports = {
    resetPasswordPost, resetPasswordPatch
  }