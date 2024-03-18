const sendEmail = require("./mail");
const sendVC = async (email, VC) => {
  await sendEmail({
    email: email,
    subject: "Account verification",
    text: `your verification code for your account is ${VC}, this code will be expired in 10 minutes so hurry please!!`,
  });
};
module.exports = sendVC;
