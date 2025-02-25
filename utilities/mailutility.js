const { gmailTransporter } = require("../config/nodemailer");

const sendMail = async ({ email, subject, text, html }) => {
  console.log("Entered send email function");
  if (!email) {
    console.log("email required for mail", email);
    console.log("Invalid Email");
    return [true, "Invalid Email"];
  }

  console.log("email ↗️", email);
  console.log("subject ⭐", subject);
  console.log("text ↗️", text);
  console.log("html ⭐", html);

  if (!text && !html) {
    console.log("Either text and html required");
    return [true, "Invalid data for email"];
  }

  try {
    const info = await gmailTransporter.sendMail({
      from: '"OTP Verification" <todoapp@real.email>',
      to: email,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Message sent: %s", info.messageId);
    return [true];
  } catch (err) {
    console.log("Internal Server eoor", err.message);
    return [false, "Invalid email please check your email"];
  }
};

module.exports = { sendMail };
