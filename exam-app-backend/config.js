require("dotenv").config();

const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URI,
  secretKey: process.env.SECRET_KEY,
};

module.exports = config;
