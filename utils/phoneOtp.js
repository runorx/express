const crypto = require("crypto");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

let otpStore = {}; // Temporary storage for OTPs (use a more secure method for production)

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
}

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

function storeOTP(phone, otp) {
  otpStore[phone] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Valid for 5 minutes
}

function verifyOTP(phone, inputOtp) {
  const storedOtpData = otpStore[phone];

  if (!storedOtpData) return false;
  if (storedOtpData.expiresAt < Date.now()) {
    delete otpStore[phone];
    return false; // OTP expired
  }

  if (storedOtpData.otp === inputOtp) {
    delete otpStore[phone]; // OTP used, remove from store
    return true;
  }

  return false;
}

module.exports = {
  generateOTP,
  sendOTPSMS,
  storeOTP,
  verifyOTP,
};

