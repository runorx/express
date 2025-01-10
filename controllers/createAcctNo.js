const genAcct = require('../helpers/generateAcctNo');
const Account = require('../models/accountModel');
const User = require('../models/userModel');

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
    const userAccount = await User.findOne({id: req.params.clientId});
    const createWalletRes = await fetch(`${process.env.MONNIFY_URL}/api/v1/disbursements/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.MONNIFY_SECRET_KEY}`,
      },
      body:JSON.stringify({
         customerName: userAccount.fullName,
         bvnDetails:{
          bvn: userAccount.bvn,
          bvnDateofBirth: userAccount.dateOfBirth,
         },
         customerEmail: userAccount.email,
         walletReference: userAccount.id,
         walletName: userAccount.fullName + userAccount.id,
      })
    })
    const walletData = await createWalletRes.json();
    if (walletData.requestSuccessful === false){
      res.status(403).send("An error occured while creating wallet")
    }

    const accountNo = walletData.responseBody.accountNumber;
    const clientId = req.params.clientId;
    if (!clientId){
      res.status(401).send("Expects client id in request body");
    }
    const existingUser = await Account.findOne({acct_no: accountNo});
    if (existingUser){
      res.status(403).send("This account number already exists, try again")
    }
    await Account.updateOne({client_id:clientId}, {acct_no: accountNo})
    res.status(200).json({accountNo, accountName: walletData.responseBody.accountName});
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
}

module.exports = {createAcctNo};