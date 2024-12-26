const express = require("express");
const router = express.Router();
const {
  validatePassword,
  checkPassword,
} = require("../middlewares/userMiddleware/userMiddlewares");
const {
  authUserProtect,
} = require("../middlewares/userMiddleware/authUsersMiddleware");

const {
  authAdminProtect,
} = require("../middlewares/adminMiddlewares/authAdminsMiddleware");

const {
  getUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  updateUserStatus,
  notificationUpdate,
} = require("../controllers/usersControllers");
const {
  checkUserStatus,
} = require("../middlewares/userMiddleware/checkUserStatus");

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

