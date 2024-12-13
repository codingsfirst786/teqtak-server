var nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  
    port: 587,               
    secure: false,                  // Use false for TLS on port 587
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_PASS
    },
    tls: {
      rejectUnauthorized: false // Bypass SSL verification if necessary (for testing)
    },
  });
module.exports = transporter
