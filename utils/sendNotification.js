const twilio = require('twilio');
const admin =  require("firebase-admin")
const Subscription = require('../models/subsModel');
//todo get app certificate for initializing the app
// this currently uses a dummy firebase config
admin.initializeApp({
    credential:admin.credential.cert("./config/firebaseConfig.json")
})

const messaging = admin.messaging()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

async function sendNotificationData(notification, to, balance, userId) {
    const { data, type } = notification;
    const userSub = await Subscription.findOne({userId})
    const state = type === "transfered-in" ? "CR" : "DR";
    const textBody = `Amount: ${data[0].transfered_Amount} ${state}\nFrom: ${data[0].from}\nBalance: ${balance} `;
    
    try {
        // Send SMS
        const smsMessage = await client.messages.create({
            body: textBody,
            to: to,  // Text this number
            from: twilioPhoneNumber
        });
        console.log(`SMS sent: ${smsMessage.sid}`);
        
        // Send WhatsApp message
        const whatsappMessage = await client.messages.create({
            body: textBody,
            to: `whatsapp:${to}`,  // WhatsApp this number
            from: `whatsapp:${twilioPhoneNumber}` // From a valid Twilio WhatsApp number
        });
        console.log(`WhatsApp message sent: ${whatsappMessage.sid}`);
        
        // Send push notification
        if (userSub){
            const token = userSub.deviceToken
            await messaging.send({
                token,
                notification: {
                    title: notification.title,
                    body: textBody
                }
            });
        }
    } catch (error) {
        console.error(`Failed to send notification: ${error.message}`);
    }
}

module.exports = sendNotificationData;