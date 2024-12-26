const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateUsersToken } = require("../helpers/generateUsersToken");

//@desc   >>>> Get All Users
//@route  >>>> GET /api/users
//@Access >>>> private(admins)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "_id user_name email user_status no_of_account"
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Get one User
//@route  >>>> GET /api/users/:id
//@Access >>>> private(User)
const getOneUser = async (req, res) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    res.status(200).json({
      name: user.user_name,
      email: user.email,
      address: user.full_addresse,
      id: user.id,
      accountsCount: user.no_of_account,
      createdAt: user.createdAt,
      userStatus: user.user_status,
      postal: user.zip_code,
      phone: user.phone,
      accounts: user.accounts,
      notifications: user.notifications,
    });
  } catch (error) {
    if (!user) return res.status(404).send("User Not Found!");
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create one User
//@route  >>>> POST /api/users/:id
//@Access >>>> public
const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      user_name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      full_addresse: req.body.addresse,
      zip_code: req.body.postal,
    });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateUsersToken(user.id, user.email),
    });
  } catch (error) {
    if (error.message.match(/(email|password|name|postal|phone|addresee)/gi)) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> user login
//@route  >>>> GET /api/users/login
//@Access >>>> public
const userLogin = async (req, res) => {
  //check for empty body
  if (!req.body.email || !req.body.password)
    return res.status(404).send("empty body request");
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
    //ckeck for password
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (isCorrectPassword) {
      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateUsersToken(user.id, user.email),
      });
    } else {
      return res.status(404).send("Wrong Credintials - wrong password");
    }
  } catch (error) {
    if (!user || !isCorrectPassword)
      return res
        .status(404)
        .send("Wrong Credintials - wrong email or password");
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE User info
//@route  >>>> PUT /api/users/:id
//@Access >>>> private(for User only)
const updateUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    //get user
    const user = await User.findById(req.params.id);
    //update user with new values
    user.email = req.body.email;
    user.markModified("email");
    user.password = hashedPassword;
    user.markModified("password");
    user.phone = req.body.phone;
    user.markModified("phone");
    user.full_addresse = req.body.addresse;
    user.markModified("full_addresse");
    user.zip_code = req.body.postal;
    user.markModified("zip_code");

    //get updated user info & send it back
    const updatedUser = await user.save();

    res.status(200).json({
      name: updatedUser.user_name,
      email: updatedUser.email,
      address: updatedUser.full_addresse,
      id: updatedUser.id,
      accountsCount: updatedUser.no_of_account,
      createdAt: updatedUser.createdAt,
      userStatus: updatedUser.user_status,
      postal: updatedUser.zip_code,
      phone: updatedUser.phone,
      accounts: updatedUser.accounts,
      notifications: updatedUser.notifications,
    });
  } catch (error) {
    if (error.message.match(/(email|password|name|postal|phone|addresee)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Notification isSeen update
//@route  >>>> PUT /api/users/notifications/:id
//@Access >>>> private(for User only)
const notificationUpdate = async (req, res) => {
  try {
    //get user
    const user = req.user;
    //update notification status
    user.notifications = user.notifications.map((notification) => {
      if (notification.id === req.params.id) {
        return { ...notification, isSeen: true };
      }
      return notification;
    });
    user.markModified("notifications");

    //get updated user info & send it back
    const updatedUser = await user.save();

    res.status(200).json({
      name: updatedUser.user_name,
      email: updatedUser.email,
      address: updatedUser.full_addresse,
      id: updatedUser.id,
      accountsCount: updatedUser.no_of_account,
      createdAt: updatedUser.createdAt,
      userStatus: updatedUser.user_status,
      postal: updatedUser.zip_code,
      phone: updatedUser.phone,
      accounts: updatedUser.accounts,
      notifications: updatedUser.notifications,
    });
  } catch (error) {
    if (error.message.match(/(notification)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one User
//@route  >>>> DELETE /api/users/:id
//@Access >>>> private(for admins only)
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedUser.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Update User's Status
//@route  >>>> put /api/users/:id/updatestatus
//@Access >>>> private(for admins only)
const updateUserStatus = async (req, res) => {
  //check if new status is actually the old status
  if (req.body.newStatus === req.body.oldStatus) {
    return res.status(400).send("Please Specify New Status For That User");
  }
  try {
    //get user
    const user = await User.findById(req.params.id);
    //update user with new Status
    user.user_status = req.body.newStatus;
    user.markModified("user_status");

    //get updated user info & send it back
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser.id,
      user_name: updatedUser.user_name,
      email: updatedUser.email,
      no_of_account: updatedUser.no_of_account,
      user_status: updatedUser.user_status,
    });
  } catch (error) {
    if (error.message.match(/(email|password|name|postal|phone|addresee)/gi))
      return res.status(400).send(error.message);
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getUsers,
  getOneUser,
  createUser,
  userLogin,
  updateUser,
  deleteUser,
  updateUserStatus,
  notificationUpdate,
};



// const User = require("../models/userModel");
// const bcrypt = require("bcryptjs");
// const { generateUsersToken } = require("../helpers/generateUsersToken");
// const { sendConfirmationCode: sendEmail, verifyConfirmationCode, sendLoginNotification } = require('../utils/sendEmail');
// const geoip = require('geoip-lite');
// const UAParser = require('ua-parser-js');

// // Get All Users
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find().select(
//       "_id user_name email user_status no_of_account"
//     );
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// // Get One User
// const getOneUser = async (req, res) => {
//   let user;
//   try {
//     user = await User.findById(req.params.id);
//     res.status(200).json({
//       name: user.user_name,
//       email: user.email,
//       address: user.full_addresse,
//       id: user.id,
//       accountsCount: user.no_of_account,
//       createdAt: user.createdAt,
//       userStatus: user.user_status,
//       postal: user.zip_code,
//       phone: user.phone,
//       accounts: user.accounts,
//       notifications: user.notifications,
//     });
//   } catch (error) {
//     if (!user) return res.status(404).send("User Not Found!");
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// // Create User (Registration)
// const createUser = async (req, res) => {
//   try {
//     // Generate and send confirmation code
//     await sendEmail(req.body.email);
//     res.status(200).json({ message: "Confirmation code sent. Please check your email." });
//   } catch (error) {
//     console.error('Error in createUser:', error);
//     res.status(500).send("Failed to send confirmation code. Please try again.");
//   }
// };

// // Send Confirmation Code
// const sendConfirmationCode = async (req, res) => {
//   try {
//     await sendEmail(req.body.email);
//     res.status(200).json({ message: "Confirmation code sent. Please check your email." });
//   } catch (error) {
//     console.error('Error in sendConfirmationCode:', error);
//     res.status(500).send("Failed to send confirmation code. Please try again.");
//   }
// };

// // User Login
// const userLogin = async (req, res) => {
//   if (!req.body.email || !req.body.password || !req.body.code)
//     return res.status(400).send("Missing required fields");

//   const { email, password, code } = req.body;

//   if (!verifyConfirmationCode(email, code)) {
//     return res.status(400).send("Invalid or expired confirmation code");
//   }

//   let user;
//   try {
//     user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     const isCorrectPassword = await bcrypt.compare(password, user.password);

//     if (isCorrectPassword) {
//       // Send login notification
//       const ip = req.ip;
//       const geo = geoip.lookup(ip);
//       const ua = UAParser(req.headers['user-agent']);
//       const deviceInfo = `${ua.browser.name} on ${ua.os.name}`;
//       const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown';

//       try {
//         await sendLoginNotification(email, deviceInfo, location, ip);
//       } catch (notificationError) {
//         console.error('Failed to send login notification:', notificationError);
//         // Continue with login process even if notification fails
//       }

//       return res.status(200).json({
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         token: generateUsersToken(user.id, user.email),
//       });
//     } else {
//       return res.status(401).send("Incorrect password");
//     }
//   } catch (error) {
//     console.error('Error in userLogin:', error);
//     res.status(500).send("An error occurred during login. Please try again.");
//   }
// };

// // Update User
// const updateUser = async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const user = await User.findById(req.params.id);
//     user.email = req.body.email;
//     user.password = hashedPassword;
//     user.phone = req.body.phone;
//     user.full_addresse = req.body.addresse;
//     user.zip_code = req.body.postal;

//     const updatedUser = await user.save();

//     res.status(200).json({
//       name: updatedUser.user_name,
//       email: updatedUser.email,
//       address: updatedUser.full_addresse,
//       id: updatedUser.id,
//       accountsCount: updatedUser.no_of_account,
//       createdAt: updatedUser.createdAt,
//       userStatus: updatedUser.user_status,
//       postal: updatedUser.zip_code,
//       phone: updatedUser.phone,
//       accounts: updatedUser.accounts,
//       notifications: updatedUser.notifications,
//     });
//   } catch (error) {
//     if (error.message.match(/(email|password|name|postal|phone|addresee)/gi))
//       return res.status(400).send(error.message);
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// // Delete User
// const deleteUser = async (req, res) => {
//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ id: deletedUser.id });
//   } catch (error) {
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// // Update User Status
// const updateUserStatus = async (req, res) => {
//   if (req.body.newStatus === req.body.oldStatus) {
//     return res.status(400).send("Please Specify New Status For That User");
//   }
//   try {
//     const user = await User.findById(req.params.id);
//     user.user_status = req.body.newStatus;
//     const updatedUser = await user.save();

//     res.status(200).json({
//       _id: updatedUser.id,
//       user_name: updatedUser.user_name,
//       email: updatedUser.email,
//       no_of_account: updatedUser.no_of_account,
//       user_status: updatedUser.user_status,
//     });
//   } catch (error) {
//     if (error.message.match(/(email|password|name|postal|phone|addresee)/gi))
//       return res.status(400).send(error.message);
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// // Update Notification
// const notificationUpdate = async (req, res) => {
//   try {
//     const user = req.user;
//     user.notifications = user.notifications.map((notification) => {
//       if (notification.id === req.params.id) {
//         return { ...notification, isSeen: true };
//       }
//       return notification;
//     });

//     const updatedUser = await user.save();

//     res.status(200).json({
//       name: updatedUser.user_name,
//       email: updatedUser.email,
//       address: updatedUser.full_addresse,
//       id: updatedUser.id,
//       accountsCount: updatedUser.no_of_account,
//       createdAt: updatedUser.createdAt,
//       userStatus: updatedUser.user_status,
//       postal: updatedUser.zip_code,
//       phone: updatedUser.phone,
//       accounts: updatedUser.accounts,
//       notifications: updatedUser.notifications,
//     });
//   } catch (error) {
//     if (error.message.match(/(notification)/gi))
//       return res.status(400).send(error.message);
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// // Verify and Register
// const verifyAndRegister = async (req, res) => {
//   const { email, code, password, name, phone, addresse, postal } = req.body;

//   if (!verifyConfirmationCode(email, code)) {
//     return res.status(400).send("Invalid or expired confirmation code");
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       user_name: name,
//       email,
//       password: hashedPassword,
//       phone,
//       full_addresse: addresse,
//       zip_code: postal,
//     });

//     res.status(201).json({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       token: generateUsersToken(user.id, user.email),
//     });
//   } catch (error) {
//     if (error.message.match(/(email|password|name|postal|phone|addresee)/gi)) {
//       return res.status(400).send(error.message);
//     }
//     res.status(500).send("Ooops!! Something Went Wrong, Try again...");
//   }
// };

// module.exports = {
//   getUsers,
//   getOneUser,
//   createUser,
//   sendConfirmationCode,
//   userLogin,
//   updateUser,
//   deleteUser,
//   updateUserStatus,
//   notificationUpdate,
//   verifyAndRegister,
// };

