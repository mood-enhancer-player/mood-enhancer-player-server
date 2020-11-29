const nodemailer = require("nodemailer");

const mailSender = async (userEmail, randomPassword, username) => {
  // console.log("userEmail", userEmail);
  // console.log("randomPassword", randomPassword);

  const mailHTML = `
  <body style="background-color: black">
  <div style="margin-left: auto; margin-right: auto; width: 60rem">
    <h1 style="color: #ffe369; text-align: center; font-size: 50px">
      Mood Enhancer
    </h1>
    <div>
      <h1 style="text-align: center; color: white; margin-bottom: 2rem">
        😔 >>> 😆
      </h1>
    </div>
    <div style="width: auto; height: auto; background-color: #90caf9">
      <div
        style="
          width: auto;
          height: 120px;
          text-align: center;
          margin: 20px;
          padding: 30px;
        "
      >
        <h1>${username},</h1>
        <h1>
          <em>Your New Mood Enhancer Password is :-</em>
          <b> ${randomPassword}</b>
        </h1>
      </div>
    </div>
  </div>
</body>
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
    subject: "Reset Password",
    text: "Reset Password",
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
