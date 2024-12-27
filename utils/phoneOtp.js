const crypto = require("crypto");
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const OTP = require("../models/otpModel"); // Import the OTP schema

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Generate a random 6-digit OTP.
 */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
}

/**
 * Send OTP to the user's phone using Twilio.
 */
async function sendOTPSMS(phone, otp) {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
      from: twilioPhoneNumber,
      to: phone,
    });
    console.log("OTP sent:", message.sid);
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP.");
  }
}

/**
 * Store OTP in the database securely.
 */
async function storeOTP(phone, otp) {
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes

  // Remove existing OTPs for the same phone
  await OTP.deleteMany({ phone });

  // Store new OTP
  await OTP.create({ phone, otp: hashedOtp, expiresAt });
}

/**
 * Verify the OTP provided by the user.
 */
async function verifyOTP(phone, inputOtp) {
  const otpEntry = await OTP.findOne({ phone });

  if (!otpEntry) throw new Error("Invalid OTP.");
  if (otpEntry.expiresAt < new Date()) throw new Error("OTP expired.");
  if (otpEntry.used) throw new Error("OTP already used.");

  const isMatch = await bcrypt.compare(inputOtp, otpEntry.otp);
  if (!isMatch) throw new Error("Invalid OTP.");

  // Mark OTP as used
  otpEntry.used = true;
  await otpEntry.save();

  return true; // OTP is valid
}

module.exports = {
  generateOTP,
  sendOTPSMS,
  storeOTP,
  verifyOTP,
};
