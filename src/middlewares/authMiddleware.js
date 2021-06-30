const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CryptoJS = require("crypto-js");

const authMiddleware = async (req, res, next) => {
  try {
    const data = req.user;

    if (req.user) {
      const userData = await User.findOne({ _id: data._id});
      req.user = userData;
      next();

    } else {

      // get the Encrypt token from browser
      const encrypted_token = await req.cookies.userToken; // Here userToken is the cookie name which is stores in browser

      // Decrypt token for jwt verification
      const token = await CryptoJS.AES.decrypt(encrypted_token, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);

      const verifyUser = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      
      const user = await User.findOne({ _id: verifyUser.id })

      // For Logout
      req.token = encrypted_token;
      req.user = user;

      next();
    }
  } catch (error) {
      res.status(401).redirect('/login');
  }
}

module.exports = authMiddleware