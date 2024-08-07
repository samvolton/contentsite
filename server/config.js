require('dotenv').config();

module.exports = {
  mailgunApiKey: process.env.MAILGUN_API_KEY,
  mailgunDomain: process.env.MAILGUN_DOMAIN,
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET,
  mongoURI: process.env.MONGODB_URI 
};
