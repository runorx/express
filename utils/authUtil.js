const jwt = require("jsonwebtoken");

/**
 * Generate JWT token for authenticated access.
 */
function generateAuthToken(user) {
  return jwt.sign({ id: user._id, phone: user.phone }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

module.exports = { generateAuthToken };
