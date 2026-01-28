import nodemailer from "nodemailer";

async function sendVerificationEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "altafziyaa91@gmail.com",
      pass: "zeeyaa123",
    },
  });

  const mailOptions = {
    from: "altafziyaa91@gmail.com",
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
export default sendVerificationEmail;
