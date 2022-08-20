let nodemailer = require("nodemailer");

const mail = {};

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "moviemail123@gmail.com",
    pass: "moviemail123",
  },
});
