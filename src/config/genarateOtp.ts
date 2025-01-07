const otpGenerator = require("otp-generator");
const fs = require("fs");

export function generateOtp() {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });
}

export function getOtpEmailTemplate(otp: string) {
  const templatePath = "/src/template/otpGenerate.html";
  let template = fs.readFileSync(templatePath, "utf-8");
  template = template.replace("{{OTP}}", otp);
  return template;
}
