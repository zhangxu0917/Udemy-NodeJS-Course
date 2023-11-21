let nodemailer = require("nodemailer");

let smtpConfig = {
  host: "smtp.exmail.qq.com", // SMTP服务器地址
  port: 465, // SMTP服务器端口号
  auth: {
    user: "david@virgos.top	", // 发件人邮箱账号
    pass: "EmailDavid6917	", // 发件人邮箱授权码（不是登录密码）
  },
};

let smtpTransport = nodemailer.createTransport(smtpConfig);

module.exports.smtpTransport = smtpTransport;
