const signup = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome Email</title>
    <style>
        body {
         
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
        .email-container {
            border: 1px solid grey;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            text-align: center;
            padding: 30px 20px;
        }
        .header h1 {
            color: white;
            font-size: 36px;
            margin: 0;
        }
        .content {
            padding: 20px 30px;
        
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin: 10px 0;
        }
        .cta {
            text-align: center;
            margin: 20px 0;
        }
        .cta a {
            text-decoration: none;
            color: white;
            background-color: #2575fc;
            padding: 12px 25px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .cta a:hover {
            background-color: #1a5db3;
        }
        .footer {
            text-align: center;
            padding: 15px 20px;
            font-size: 14px;
            color: white;
            background-color: #6a11cb;
        }
        .footer p {
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to TeqTak!</h1>
        </div>
        <div class="content">
            <p>Greetings 🎉</p>
            <p>We are thrilled to have you join us! TeqTak is designed to make your experience seamless and enjoyable. Here, you'll find a community of like-minded individuals and tools to help you achieve your goals.</p>
            <p>If you have any questions or need assistance, our support team is always here to help.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 TeqTak. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
module.exports = {signup}