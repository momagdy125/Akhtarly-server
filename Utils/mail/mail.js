const nodemailer = require("nodemailer");

const sendEmail = async (Options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email_Username,
      pass: process.env.email_Password,
    },
  });

  const mailOptions = {
    from: "Akhtarly app <AkhtarlyCompany@gmail.com>",
    to: Options.email,
    subject: Options.subject,
    text: Options.text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
