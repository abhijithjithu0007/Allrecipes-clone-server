const otpGenerator = require("otp-generator");
import path from "path";
import fs from "fs";

export function generateOtp() {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
}

export function getOtpEmailTemplate(otp: string) {
  const templatePath = path.resolve(
    __dirname,
    "src",
    "template",
    "otpGenerate.html"
  );
  let template = fs.readFileSync(templatePath, "utf-8");
  template = template.replace("{{OTP}}", otp);
  return template;
}
