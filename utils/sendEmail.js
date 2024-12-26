const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create a transporter using SMTP with TLS support
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use false for port 587 (non-SSL/TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only use this for testing. Remove in production.
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Transporter verification error:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Generate a secure random 6-digit confirmation code
const generateConfirmationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Store confirmation codes with expiration times (15 minutes)
const confirmationCodes = new Map();

// Send confirmation code email
const sendConfirmationCode = async (email) => {
  const code = generateConfirmationCode();
  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes from now

  // Store the code with its expiration time
  confirmationCodes.set(email, { code, expirationTime });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your Confirmation Code',
    text: `Your confirmation code is: ${code}\nThis code will expire in 15 minutes.`,
    html: `<p>Your confirmation code is: <strong>${code}</strong></p><p>This code will expire in 15 minutes.</p>`,
  };

  // Attempt to send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation code sent successfully to', email);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending confirmation code:', error);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw new Error('Failed to send confirmation code');
  }
};

// Verify the confirmation code
const verifyConfirmationCode = (email, code) => {
  const storedData = confirmationCodes.get(email);
  if (!storedData) {
    console.log('No confirmation code stored for this email.');
    return false;
  }

  const { code: storedCode, expirationTime } = storedData;

  // Check if the code has expired
  if (Date.now() > expirationTime) {
    confirmationCodes.delete(email); // Remove expired code
    console.log('Confirmation code expired');
    return false;
  }

  // Verify if the provided code matches
  if (code === storedCode) {
    confirmationCodes.delete(email); // Remove used code
    console.log('Confirmation code verified successfully');
    return true;
  }

  console.log('Incorrect confirmation code');
  return false;
};

// Send login notification email
const sendLoginNotification = async (email, deviceInfo, location, ipAddress) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'New Login Detected',
    text: `A new login was detected for your account.\n\nDevice: ${deviceInfo}\nLocation: ${location}\nIP Address: ${ipAddress}\nTime: ${new Date().toUTCString()}\n\nIf this wasn't you, please contact our support team immediately.`,
    html: `<h2>New Login Detected</h2>
           <p>A new login was detected for your account.</p>
           <ul>
             <li><strong>Device:</strong> ${deviceInfo}</li>
             <li><strong>Location:</strong> ${location}</li>
             <li><strong>IP Address:</strong> ${ipAddress}</li>
             <li><strong>Time:</strong> ${new Date().toUTCString()}</li>
           </ul>
           <p>If this wasn't you, please contact our support team immediately.</p>`,
  };

  // Attempt to send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Login notification sent successfully to', email);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending login notification:', error);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw new Error('Failed to send login notification');
  }
};

module.exports = {
  sendConfirmationCode,
  verifyConfirmationCode,
  sendLoginNotification,
};

