const mongoose = require("mongoose");
const { notificationSchema } = require("./notificationSchema");
const { autoIncrement } = require("mongoose-plugin-autoinc");

//Define User Schema
const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: [true, "Please Type A User Name!"],
      validate: {
        validator: function (v) {
          let regex = new RegExp(
            "^(?=[a-zA-Z0-9._ ]{10,35}$)(?!.*[_.]{2})[^_.].*[^_.]$"
            /*   no >>> _ or . at the beginning
            no >>>__ or _. or ._ or .. inside 
            no >>> _ or . at the end
            [a-zA-Z0-9._] >> allowed characters
            username is {10-} characters long
            */
          );
          return regex.test(v);
        },
        message: "Please Enter A Valid User Name!",
      },
    },
    fullName:{
      type: String,
      required: [true, "Please Type A Full Name!"],
      validate: {
        validator: function (v) {
          let regex = new RegExp("^[a-zA-Z]+ [a-zA-Z]+$");
          return regex.test(v);
        },
        message: "Please Enter A Valid Full Name!",
      },
    },
    email: {
      type: String,
      required: [true, "Please Type An Email!"],
      unique: true,
      validate: {
        validator: function (v) {
          let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
          return regex.test(v);
        },
        message: "Please Enter A Valid Email!",
      },
    },
    password: {
      type: String,
      required: [true, "Please Type A Password!"],
    },
    // phone: {
    //   type: Number,
    //   required: [true, "Please Type AN EGY Phone Number!"],
    //   unique: true,
    //   validate: {
    //     validator: function (v) {
    //       // let regex = new RegExp("^(1)[0-2,5]{1}[0-9]{8}");
    //       let regex = new RegExp("^\\+?[0-9]{1,15}$");
    //       return regex.test(v) && v.toString().length === 10;
    //     },
    //     message: "Please Enter A Valid EGY Phone Number!",
    //   },
    // },
    bvn: {
      type: String,
      required: [true, "Please Type A BVN!"],
      validate: {
        validator: function (v) {
          let regex = new RegExp("^[0-9]{11}$");
          return regex.test(v);
        },
        message: "Please Enter A Valid BVN!",
    }},
    dateOfBirth:{
      type: Date,
      required: [true, "Please Type A Date Of Birth!"],
    },

    phone: {
      type: String, // Change to String to accommodate '+' and non-numeric characters
      required: [true, "Please provide a phone number!"],
      unique: true,
      validate: {
        validator: function (v) {
          let regex = new RegExp("^\\+?[1-9][0-9]{1,14}$"); // Matches international phone numbers globally
          return regex.test(v); // Validate against the regex
        },
        message: "Please enter a valid phone number!",
      },
    },
    full_addresse: {
      type: String,
      required: [true, "Please Type An Addresse!"],
    },
    zip_code: {
      type: Number,
      required: [true, "Please Type A Zip/Postal Code!"],
      validate: {
        validator: function (v) {
          let regex = new RegExp("^[0-9]{5}$");
          return regex.test(v);
        },
        message: "Please Enter A Valid Zip/Postal Code",
      },
    },
    role: {
      type: String,
      default: "Client",
      immutable: true,
    },
    user_status: {
      type: Number,
      default: 0, //active , 1 >> unactive, 2 >>suspended
    },
    no_of_account: {
      type: Number,
      default: 0,
      max: [
        3,
        "Sorry, You Can Not Add More Than 3 Accounts in your Bank Profile",
      ],
    },
    accounts: [String],
    notifications: [notificationSchema],
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

//handle duplicate 'Key' error when 'SAVING' a User
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    let dupKeys = Object.keys(error.keyPattern);
    next(new Error(`This ${dupKeys} is Already Used By Another User!`));
  } else {
    next();
  }
});

//handle duplicate 'Key' error when 'UPDATING' a User
userSchema.post("updateOne", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    let dupKeys = Object.keys(error.keyPattern);
    next(new Error(`This ${dupKeys} is Already Used By Another User!`));
  } else {
    next();
  }
});

//Auto Increament Users ID Plugin
userSchema.plugin(autoIncrement, {
  model: "User",
  startAt: 2525500300,
  incrementBy: 1,
});

//Define User Model
const User = mongoose.model("User", userSchema);

module.exports = User;
