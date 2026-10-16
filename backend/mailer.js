const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host:   process.env.ZEPTOMAIL_HOST || "smtp.zeptomail.com",
  port:   587,
  secure: false,
  auth: {
    user: process.env.ZEPTOMAIL_USER,
    pass: process.env.ZEPTOMAIL_TOKEN,
  },
});
