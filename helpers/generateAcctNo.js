/**
 * simple function to generate a random 10 digit account number
 * @returns {string} accountNumber
 */
function generateAccountNumber() {
    let accountNumber = '';
    for (let i = 0; i < 10; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    return accountNumber;
}

module.exports = generateAccountNumber;