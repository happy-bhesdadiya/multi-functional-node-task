require("dotenv").config();
const User = require('../models/User');
const { tokenVerification } = require("./jwtToken");
const CryptoJS = require("crypto-js");

const getUserFromCookie = async (req, res) => {
    try {
      const encrypted_token = req.cookies["userToken"];
      
      if (!encrypted_token)
        return res.status(401).send('Token not Found!');
        const token = CryptoJS.AES.decrypt(encrypted_token, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
      const decoded = await tokenVerification(token);
      const user = await User.findById(decoded.id);
      
      if (user === null)
        return res.status(403).send('User not Found!');
      else return user;
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
};

module.exports = getUserFromCookie;
