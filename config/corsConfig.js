// /* CORS domains configuration */

// // Devlopement CORS Configurations//

// const devWhitelist = ["http://localhost:3000"];

// const corsDevOptions = {
//   origin: function (origin, callback) {
//     if (!origin || devWhitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },

//   credentials: true,
// };

// // Production CORS Configurations//

// const domainsFromEnv = process.env.CORS_DOMAINS || "";

// const productionWhitelist = domainsFromEnv
//   .split(",")
//   .map((item) => item.trim());

// const corsProOptions = {
//   origin: function (origin, callback) {
//     if (!origin || productionWhitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },

//   credentials: true,
// };

// module.exports = {
//   corsDevOptions,
//   corsProOptions,
// };



/* CORS domains configuration */

// Development CORS Configurations
const devWhitelist = ["http://localhost:3000"];

const corsDevOptions = {
  origin: function (origin, callback) {
    if (!origin || devWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} not allowed in development.`));
    }
  },
  credentials: true,
};

// Production CORS Configurations
const domainsFromEnv = process.env.CORS_DOMAINS || "";

const productionWhitelist = domainsFromEnv
  ? domainsFromEnv.split(",").map((item) => item.trim())
  : [];

const corsProOptions = {
  origin: function (origin, callback) {
    if (!origin || productionWhitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS error: Origin ${origin} not allowed in production.`));
    }
  },
  credentials: true,
};

// Unified Export Based on Environment
const isProduction = process.env.NODE_ENV === "production";

const corsOptions = isProduction ? corsProOptions : corsDevOptions;

module.exports = {
  corsOptions,
};
