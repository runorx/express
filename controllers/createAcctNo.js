const genAcct = require('../helpers/generateAcctNo');
const Account = require('../models/accountModel');

/**
 * Asynchronously creates an account number for a client and updates the account information.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters of the request.
 * @param {string} req.params.clientId - The ID of the client.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the account number is created and updated.
 *
 * @throws {Error} - Throws an error if the account number already exists or if there is an issue with the request.
 */
const createAcctNo = async (req, res) => {
  try {
    const accountNo = genAcct();
    const clientId = req.params.clientId;
    if (!clientId){
      res.status(401).send("Expects client id in request body");
    }
    const existingUser = await Account.findOne({acct_no: accountNo});
    if (existingUser){
      res.status(403).send("This account number already exists, try again")
    }
    await Account.updateOne({client_id:clientId}, {acct_no: accountNo})
    res.status(200).send(accountNo);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
}

module.exports = {createAcctNo};