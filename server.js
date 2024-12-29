require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

// app.set("trust proxy", true); // Enable trust proxy

//connect to mongodb
const { connectToMongoose } = require("./config/db");

//middlewares
//express json parser middleware
app.use(express.json());

//cors middleware
const { corsProOptions } = require("./config/corsConfig");
app.use(cors(corsProOptions));

// Apply the rate limiting middleware to API calls only
const {
  apiLimiter,
} = require("./middlewares/rateLimitMiddleware/rateLimitMiddleware");
app.use("/api", apiLimiter);

//users Router
const usersRoute = require("./routes/usersRoutes");
app.use("/api/users", usersRoute);

//admins Router
const adminsRoute = require("./routes/adminRoutes");
app.use("/api/admins", adminsRoute);

//account Router
const accountRoute = require("./routes/accountRoutes");
app.use("/api/account", accountRoute);

//account requests Router
const accountRequestRoute = require("./routes/accountRequestRoutes");
app.use("/api/request", accountRequestRoute);



connectToMongoose()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("server is running");
    });
  })
  .catch((err) => {
    console.log(err);
  });
