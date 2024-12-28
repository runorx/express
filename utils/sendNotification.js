const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

function sendNotificationData(notification, to, balance) {
    const {  message, data, type } = notification;
    
    const state = type === "transfered-in" ? "CR" : "DR"
    const textBody = `Amount: ${data[0].transfered_Amount} ${state}\nFrom: ${data[0].from}\nBalance: ${balance} `
    // Send SMS
    client.messages.create({
        body: textBody,
        to: to,  // Text this number
        from: twilioPhoneNumber
    })
    .then((message) => console.log(`SMS sent: ${message.sid}`))
    .catch((error) => console.error(`Failed to send SMS: ${error.message}`));

    // Send WhatsApp message
    client.messages.create({
        body: textBody,
        to: `whatsapp:${to}`,  // WhatsApp this number
        from: `whatsapp:${twilioPhoneNumber}` // From a valid Twilio WhatsApp number
    })
    .then((message) => console.log(`WhatsApp message sent: ${message.sid}`))
    .catch((error) => console.error(`Failed to send WhatsApp message: ${error.message}`));
}

module.exports = sendNotificationData;