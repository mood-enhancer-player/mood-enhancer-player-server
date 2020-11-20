const nodemailer = require("nodemailer");

const mailSender = async (userEmail, randomPassword) => {
  console.log("userEmail", userEmail);
  console.log("randomPassword", randomPassword);

  const mailHTML = `
<h1>Mood Enhancer</h1>
<div
  style="width: 200px; height: 150px; background-color: black; color: white"
>
  You new Password is <b> ${randomPassword}</b>
</div>
`;

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
    text: "Hello World",
    html: mailHTML,
    // attachments: [
    //   {
    //     filename: "mailtrap.png",
    //     path:
    //       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.e7cg2xzIv-MLiN4KGq2SJAFNC7%26pid%3DApi&f=1",
    //     cid: "uniq-mailtrap.png",
    //   },
    // ],
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { mailSender };
