const mongoose = require('mongoose');

/**
 * Schema representing a subscription.
 * 
 * @typedef {Object} Subscription
 * @property {mongoose.Schema.Types.ObjectId} userId - The ID of the user associated with the subscription.
 * @property {string} deviceToken - The device token for push notifications.
 */
const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    deviceToken: {
        type: String,
        required: true
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;