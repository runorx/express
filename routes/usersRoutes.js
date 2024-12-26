// const express = require("express");
// const router = express.Router();
// const {
//   validatePassword,
//   checkPassword,
// } = require("../middlewares/userMiddleware/userMiddlewares");
// const {
//   authUserProtect,
// } = require("../middlewares/userMiddleware/authUsersMiddleware");

// const {
//   authAdminProtect,
// } = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

// const {
//   getUsers,
//   getOneUser,
//   createUser,
//   updateUser,
//   deleteUser,
//   userLogin,
//   updateUserStatus,
//   notificationUpdate,
// } = require("../controllers/usersControllers");
// const {
//   checkUserStatus,
// } = require("../middlewares/userMiddleware/checkUserStatus");

// router
//   .route("/")
//   .get(authAdminProtect, getUsers)
//   .post(validatePassword, createUser);

// router
//   .route("/:id")
//   .get(authUserProtect, getOneUser)
//   .put(
//     authUserProtect,
//     checkUserStatus,
//     checkPassword,
//     validatePassword,
//     updateUser
//   )
//   .delete(authAdminProtect, deleteUser);

// router.route("/login").post(userLogin);

// router.route("/:id/updatestatus").put(authAdminProtect, updateUserStatus);

// router
//   .route("/notifications/:id")
//   .put(authUserProtect, checkUserStatus, notificationUpdate);

// module.exports = router;


// const express = require("express");
// const router = express.Router();

// const {
//   validatePassword,
//   checkPassword,
// } = require("../middlewares/userMiddleware/userMiddlewares");

// const {
//   authUserProtect,
// } = require("../middlewares/userMiddleware/authUsersMiddleware");

// const {
//   authAdminProtect,
// } = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

// const {
//   checkUserStatus,
// } = require("../middlewares/userMiddleware/checkUserStatus");

// const {
//   getUsers,
//   getOneUser,
//   createUser,
//   updateUser,
//   deleteUser,
//   userLogin,
//   updateUserStatus,
//   notificationUpdate,
//   verifyAndRegister,
//   sendConfirmationCode,
// } = require("../controllers/usersControllers");

// // Get all users (admin only)
// router.route("/").get(authAdminProtect, getUsers);

// // Create new user (registration)
// router.route("/register").post(validatePassword, createUser);

// // User login - send confirmation code
// router.route("/login").post(sendConfirmationCode);

// // User login - verify confirmation code and complete login
// router.route("/login/verify").post(userLogin);

// // Verify registration and complete user creation
// router.route("/verify").post(validatePassword, verifyAndRegister);

// // Get, update, or delete a specific user
// router
//   .route("/:id")
//   .get(authUserProtect, getOneUser)
//   .put(
//     authUserProtect,
//     checkUserStatus,
//     checkPassword,
//     validatePassword,
//     updateUser
//   )
//   .delete(authAdminProtect, deleteUser);

// // Update user status (admin only)
// router.route("/:id/updatestatus").put(authAdminProtect, updateUserStatus);

// // Update notification status
// router
//   .route("/notifications/:id")
//   .put(authUserProtect, checkUserStatus, notificationUpdate);

// module.exports = router;




const express = require("express");
const router = express.Router();
const { validatePassword, checkPassword } = require("../middlewares/userMiddleware/userMiddlewares");
const { authUserProtect } = require("../middlewares/userMiddleware/authUsersMiddleware");
const { authAdminProtect } = require("../middlewares/adminMiddlewares/authAdminsMiddleware");
const { getUsers, getOneUser, createUser, updateUser, deleteUser, userLogin, updateUserStatus, notificationUpdate } = require("../controllers/usersControllers");
const { checkUserStatus } = require("../middlewares/userMiddleware/checkUserStatus");

// Import the OTP functions
const { sendOTPEmail, verifyOTP } = require("../utils/sendEmail");

// Route to send OTP email (triggered during login process)
router.route("/send-otp").post(async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).send("Email is required.");
    }
    await sendOTPEmail(email);
    return res.status(200).send("OTP sent to your email. Please verify it to complete login.");
  } catch (error) {
    return res.status(500).send("Error sending OTP: " + error.message);
  }
});

// Route to verify OTP (to be called after the user enters the OTP)
router.route("/verify-otp").post((req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send("Email and OTP are required.");
  }

  const isVerified = verifyOTP(email, otp);

  if (isVerified) {
    return res.status(200).send("OTP verified successfully.");
  } else {
    return res.status(400).send("Invalid or expired OTP.");
  }
});

router
  .route("/")
  .get(authAdminProtect, getUsers)
  .post(validatePassword, createUser);

router
  .route("/:id")
  .get(authUserProtect, getOneUser)
  .put(
    authUserProtect,
    checkUserStatus,
    checkPassword,
    validatePassword,
    updateUser
  )
  .delete(authAdminProtect, deleteUser);

router.route("/login").post(userLogin);

router.route("/:id/updatestatus").put(authAdminProtect, updateUserStatus);

router
  .route("/notifications/:id")
  .put(authUserProtect, checkUserStatus, notificationUpdate);

module.exports = router;
