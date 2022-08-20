let nodemailer = require("nodemailer");

const mail = {};

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "moviemail123@gmail.com",
    pass: "moviemail123",
  },
});

mail.sendVerification = (email, link) => {
  let options = {
    from: "Movie",
    to: email,
    subject: "Verification",
    text: "Vui lòng click vào link dưới để tiếp tục \n" + linl,
  };
  transporter.sendMail(options);
};
