const appliedToAJob = (username, resumeUrl, jobId) => (
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #6a11cb, #2575fc);
            color: #ffffff;
            text-align: center;
        }
        .container {
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            background-color: #ffffff;
            color: #333333;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .header {
            padding: 20px;
            background: linear-gradient(135deg, #2575fc, #6a11cb);
            border-radius: 10px 10px 0 0;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
        }
        .profile {
            margin: 20px 0;
        }
        .profile img {
            border-radius: 50%;
            width: 100px;
            height: 100px;
            object-fit: cover;
            border: 3px solid #2575fc;
        }
        .content {
            text-align: left;
            margin: 20px;
        }
        .content p {
            margin: 10px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            color: #ffffff;
            background: #6a11cb;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #aaaaaa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ New Job Post Alert! ✨</h1>
        </div>

        <div class="profile">
            <h2>${username}</h2>
        </div>

        <div class="content">
            <p><strong>Job ID:</strong> ${jobId}</p>
            <p>We thought you'd like to know about this amazing opportunity. Click below to see the full details and apply if it piques your interest!</p>
           <center> <a href="${resumeUrl}" class="button">Download Resume</a></center>
        </div>
    </div>
</body>
</html>
`)

module.exports = { appliedToAJob }