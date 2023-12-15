const nodemailer = require('nodemailer')

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ebf0e738bf9a23",
      pass: "5f57c5b1460c22"
    }
  });

  module.exports = transport; 