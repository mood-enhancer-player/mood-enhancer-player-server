const nodemailer = require("nodemailer");

const mailSender = (userEmail) => {
  console.log("userEmail", userEmail);
  //Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Step 2
  let mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Hello World",
    text: "Mood enhancer",
  };

  // Step 3

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error ", err);
      return err;
    } else {
      console.log("Send Email !!", data);
      return data;
    }
  });
};

module.exports = { mailSender };
