"use strict";
const nodemailer = require("nodemailer");
const keys = require("../config/keys");


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: keys.emailUserName,
      pass: keys.emailPassword
    },
    tls: {
      rejectUnauthorized: false
  }
});

const sendMail = async(emailInfo) => {
  return new Promise(async(resolve, reject) => {
    try {
      // send mail with defined transport object
      let info = await transporter.sendMail(emailInfo);
      resolve(info);
    } catch (error) {
      console.log("error email", error.message);
    }
  })

}

const emailProcessor = ({email, subject, text, html}) => {
  const emailInfo = {
    from: '"sule kam" <darius.williamson92@ethereal.email>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text,
    html: html, // html body
  }
  sendMail(emailInfo);

} 

module.exports = {
  emailProcessor
}



