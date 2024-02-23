const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create Transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    port: 465,
    // secure: process.env.NODE_ENV !== 'development',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    tls: {
      ciphers: 'SSLv3',
    },
  });

  // 2) Define Options
  const mailOptions = {
    from: `Pinnalgo ${process.env.EMAIL_USER}`,
    to: options.email,
    subject: options.subject,
    text: options.text,
    attachments: options.attachment ? options.attachment : null,
    html: options.html ? options.html : null,
    replyTo: 'support@pinnalgo',
  };
  // 3) Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
