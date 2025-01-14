module.exports.getOtpTemplate = (otp) => {
    return `
      <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
    
      border: 1px solid #e6c88b; /* Soft golden border */
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      font-size: 24px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
      background: linear-gradient(90deg, #d4af37, #c9a43c); /* Golden gradient */
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }
    .header-content {
      padding: 15px 0; /* Padding inside the header */
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #d4af37; /* Bright golden color */
      text-align: center;
      margin: 20px 0;
    }
    .message {
      font-size: 16px;
      color: #555555;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #a8915f; /* Subtle golden shade */
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="header-content">Password Reset Request</div>
    </div>
    <div style="padding: 20px;">
        <div class="message">
            Dear User,
            <br><br>
            We received a request to reset the password for your Shanon Group account.
            <br><br>
            Your One-Time Password (OTP) is:
          </div>
          <div class="otp">${otp}</div>
          <div class="message">
            Please use this OTP to complete the password reset process. This code is valid for 5 minutes.
            <br><br>
            If you did not request this, please ignore this email or contact our support team.
          </div>
          <div class="footer">
            © 2024 Shanon Group. All rights reserved.
          </div>
    </div>
  </div>
</body>
</html>
    `;
  };
  