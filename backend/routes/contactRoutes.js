import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("=== CONTACT FORM SUBMISSION ===");
  console.log("Body received:", req.body);
  
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: "Name, email, and message are required" 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: "Please enter a valid email address" 
    });
  }

  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      return res.status(500).json({ 
        success: false, 
        error: "Server configuration error" 
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"GP Flower Decorators" <${process.env.MAIL_USER}>`,
      to: "gpflowerdecorators@gmail.com",
      replyTo: email,
      subject: `🌸 New Contact: ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #374151; 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); 
    }
    .container { 
      background: white; 
      padding: 40px; 
      border-radius: 20px; 
      box-shadow: 0 20px 40px rgba(236, 72, 153, 0.15); 
      border: 1px solid rgba(236, 72, 153, 0.2);
      position: relative;
      overflow: hidden;
    }
    .container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #ec4899, #f9a8d4, #ec4899);
    }
    .header { 
      text-align: center; 
      padding-bottom: 30px; 
      border-bottom: 3px solid #fecdd3; 
      margin-bottom: 30px;
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      background: linear-gradient(135deg, #ec4899, #f472b6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
    .timestamp { 
      background: #fdf2f8; 
      padding: 14px 18px; 
      border-radius: 12px; 
      font-size: 14px; 
      color: #be185d; 
      margin-top: 15px;
      border-left: 4px solid #ec4899;
    }
    .field { 
      margin: 25px 0; 
      padding: 24px; 
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); 
      border-left: 5px solid #ec4899; 
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.1);
      transition: all 0.3s ease;
    }
    .field:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(236, 72, 153, 0.2);
    }
    .label { 
      font-weight: 600; 
      color: #be185d; 
      font-size: 14px; 
      margin-bottom: 12px; 
      display: block; 
      text-transform: uppercase;
      letter-spacing: 1px;
      background: rgba(236, 72, 153, 0.1);
      padding: 6px 12px;
      border-radius: 20px;
      display: inline-block;
    }
    .value { 
      font-size: 16px; 
      color: #1f2937; 
      line-height: 1.6; 
      font-weight: 400;
    }
    .message-value {
      white-space: pre-wrap;
      background: white;
      padding: 20px;
      border-radius: 12px;
      border: 2px solid #fecdd3;
      box-shadow: inset 0 2px 8px rgba(236, 72, 153, 0.05);
      margin-top: 12px;
    }
    .footer { 
      text-align: center; 
      margin-top: 40px; 
      padding-top: 25px; 
      border-top: 2px solid #fecdd3; 
      color: #9d174d; 
      font-size: 14px; 
    }
    .footer strong {
      color: #ec4899;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌸 New Contact Form</h1>
      <div class="timestamp">
        Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      </div>
    </div>
    
    <div class="field">
      <span class="label">Customer Name</span>
      <span class="value">${name}</span>
    </div>
    
    <div class="field">
      <span class="label">Email Address</span>
      <span class="value">${email}</span>
    </div>
    
    <div class="field">
      <span class="label">Message</span>
      <div class="message-value">${message}</div>
    </div>
    
    <div class="footer">
      <p><strong>GP Flower Decorators</strong></p>
      <p>Mallikarjuna Complex, T Narasipura | +91 9964118761</p>
      <p><em>Automated message from website contact form</em></p>
    </div>
  </div>
</body>
</html>
      `,
    });

    console.log(`✅ SUCCESS: Email sent from ${email}`);
    res.json({ success: true, message: "Message sent successfully!" });

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email. Please try again." 
    });
  }
});

export default router;
