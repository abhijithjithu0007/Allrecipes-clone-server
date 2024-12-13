const nodemailer = require("nodemailer");
require("dotenv").config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  service: "gmail",
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
