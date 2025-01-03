const Subscription = require('../models/subsModel');

/**
 * Saves a new subscription to the database.
 *
 * @async
 * @function saveSubscription
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user.
 * @param {string} req.body.deviceToken - The device token.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * @throws {Error} - Throws an error if there is a server error.
 */
const saveSubscription = async (req, res) => {
    try {
        const { userId, deviceToken } = req.body;

        if (!userId || !deviceToken) {
            return res.status(400).json({ message: 'User ID and device token are required' });
        }

        const newSubscription = new Subscription({
            userId,
            deviceToken
        });

        await newSubscription.save();

        res.status(201).json({ message: 'Subscription saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

/**
 * Deletes a subscription from the database.
 *
 * @async
 * @function deleteSubscription
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.userId - The ID of the user.
 * @param {string} req.body.deviceToken - The device token.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 * @throws {Error} - Throws an error if there is a server error.
 */
const deleteSubscription = async (req, res) => {
    try {
        const { userId} = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const result = await Subscription.deleteOne({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Subscription not found' });
        }

        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    saveSubscription,
    deleteSubscription
};