const Starter = (userName,desc) =>{
    return `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Template</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
          color: #333;
        }
    
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
    
        .email-header {
          background-color: #4CAF50;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
    
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
    
        .email-body {
          padding: 20px;
        }
    
        .email-body p {
          line-height: 1.6;
          font-size: 16px;
          margin: 0 0 10px;
        }
    
        .email-button {
          display: inline-block;
          margin: 20px 0;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #4CAF50;
          text-decoration: none;
          border-radius: 4px;
        }
    
        .email-footer {
          background-color: #f4f4f4;
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #999;
        }
    
        .email-footer a {
          color: #4CAF50;
          text-decoration: none;
        }
    
        @media (max-width: 600px) {
          .email-container {
            margin: 10px;
          }
    
          .email-header h1 {
            font-size: 20px;
          }
    
          .email-body p {
            font-size: 14px;
          }
    
          .email-button {
            font-size: 14px;
            padding: 8px 16px;
          }
        }
      </style>
    </head>
    
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Welcome to TeqTak!</h1>
        </div>
        <div class="email-body">
          <p>Hello ${userName},</p>
          <p>Thank you for signing up for our service. We're excited to have you on board!</p>
          <p>Click the button below to get started:</p>
          <a href="[Your Action URL]" class="email-button">Get Started</a>
          <p>${desc?desc:""}</p>
          <p>Best regards,</p>
          <p><strong>TeqTak</strong></p>
        </div>
        <div class="email-footer">
          <p>You received this email because you signed up for TeqTak</p>
        </div>
      </div>
    </body>
    
    </html>
    `
  }
  
  // console.log(email("muneeb"))
  
  
  module.exports =  {Starter}