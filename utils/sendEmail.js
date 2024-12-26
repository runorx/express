// const nodemailer = require("nodemailer");
// const crypto = require("crypto");

// let otpStore = {}; // Temporary storage for OTPs (use a more secure method for production)

// /**
//  * Generate a 6-digit OTP
//  */
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000);
// };

// /**
//  * Send an OTP email
//  * @param {string} email - Recipient email address
//  * @returns {Promise<number>} - Returns the OTP
//  */
// const sendOTPEmail = async (email) => {
//   const otp = generateOTP();

//   // Save OTP in the store with a TTL (time-to-live) of 5 minutes
//   otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GMAIL_USER, // Replace with your Gmail address
//       pass: process.env.GMAIL_PASS, // Replace with your Gmail App Password
//     },
//   });

//   const mailOptions = {
//     from: process.env.GMAIL_USER,
//     to: email,
//     subject: "Your OTP for Login",
//     text: `Your OTP for login is: ${otp}. It will expire in 5 minutes.`,
//   };

//   await transporter.sendMail(mailOptions);

//   return otp;
// };

// /**
//  * Verify the OTP
//  * @param {string} email - Email for which OTP was sent
//  * @param {number} otp - OTP to verify
//  * @returns {boolean} - Returns true if OTP is valid
//  */
// const verifyOTP = (email, otp) => {
//   const storedOtpData = otpStore[email];

//   if (!storedOtpData) return false;
//   if (storedOtpData.expiresAt < Date.now()) {
//     delete otpStore[email];
//     return false; // OTP expired
//   }

//   if (storedOtpData.otp === otp) {
//     delete otpStore[email]; // OTP used, remove from store
//     return true;
//   }

//   return false;
// };

// module.exports = { sendOTPEmail, verifyOTP };



const nodemailer = require("nodemailer");
const crypto = require("crypto");

let otpStore = {}; // Temporary storage for OTPs (use a more secure method for production)

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Send an OTP email
 * @param {string} email - Recipient email address
 * @returns {Promise<number>} - Returns the OTP
 */
const sendOTPEmail = async (email) => {
  const otp = generateOTP();

  // Save OTP in the store with a TTL (time-to-live) of 5 minutes
  otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER, // Replace with your Gmail address
      pass: process.env.GMAIL_PASS, // Replace with your Gmail App Password
    },
  });

  const mailOptions = {
    from: '"Express Bank"  process.env.GMAIL_USER',
    to: email,
    subject: "OTP Code",

    html: `
    <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px; color: #2c3e50;">
      <h2 style="color: #1a237e; text-align: center;">Express Bank</h2>
      <p>Dear Valued Customer,</p>
      <p>Thank you for banking with Express Bank.</p>
      <p>Your One-Time Password (OTP) for login is:</p>
      <div style="background-color: #e0f7fa; color: #1a237e; font-size: 18px; font-weight: bold; padding: 10px; text-align: center; border-radius: 5px;">
        ${otp}
      </div>
      <p style="margin-top: 15px;">It will expire in 5 minutes. Please do not disclose this code to anyone.</p>
      
      <p>For further assistance, kindly contact our customer support through the following channels:</p>
      <ul>
        <li>Email: <a href="mailto:customerservice@expressbank.com">customerservice@expressbank.com</a></li>
        <li>Phone: +1-800-123-4567</li>
      </ul>
      <p>Thank you for choosing Express Bank.</p>
      <hr style="border: none; border-top: 1px solid #d1d1d1; margin: 20px 0;">
      <p style="font-size: 12px; text-align: center;">
        Headquarters: 123 Financial Avenue, Suite 456, Finance City, FC 78901<br>
        Copyright © ${new Date().getFullYear()} Express Bank - All rights reserved.
      </p>
      <p style="font-size: 12px; text-align: center; color: #7f8c8d;">
        Express Bank is a fully licensed financial institution regulated by the Central Banking Authority. Your deposits are insured up to applicable limits.<br>
        This is an automated message. Please do not reply.
      </p>
    </div>
  `,
    // text: `NONE DISCLOSURE!!! Your OTP for login is: ${otp}. It will expire in 5 minutes. Do not diclose to anyone. `,
    // text: `
    // Dear Valued Customer,
    
    // Thank you for banking with Express Bank.
    
    // Your One-Time Password (OTP) for login is: ${otp}. It will expire in 5 minutes. Please do not disclose this code to anyone.
    
    
    // For further assistance, kindly contact our customer support through the following channels:
    // - Email: customerservice@expressbank.com
    // - Phone: +1-800-123-4567
    
    // Thank you for choosing Express Bank.
    
    // Headquarters: 123 Financial Avenue, Suite 456, Finance City, FC 78901
    // Copyright © ${new Date().getFullYear()} Express Bank - All rights reserved.
    
    // Express Bank is a fully licensed financial institution regulated by the Central Banking Authority. Your deposits are insured up to applicable limits.
    
    // ---
    // This is an automated message. Please do not reply.
    //   `,


 
  };

  await transporter.sendMail(mailOptions);

  return otp;
};

/**
 * Verify the OTP
 * @param {string} email - Email for which OTP was sent
 * @param {number} otp - OTP to verify
 * @returns {boolean} - Returns true if OTP is valid
 */
const verifyOTP = (email, otp) => {
  const storedOtpData = otpStore[email];

  if (!storedOtpData) return false;
  if (storedOtpData.expiresAt < Date.now()) {
    delete otpStore[email];
    return false; // OTP expired
  }

  if (storedOtpData.otp === parseInt(otp)) {
    delete otpStore[email]; // OTP used, remove from store
    return true;
  }

  return false;
};

module.exports = { sendOTPEmail, verifyOTP };

