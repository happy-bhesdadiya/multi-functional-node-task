require("dotenv").config();
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User = require('../models/User');

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

const tokenGeneration = async (UserID) => {
  try {
    const token = await jwt.sign(UserID, jwtSecretKey, { expiresIn: sevenDays });
    
    const user = await User.findOne({ _id: UserID.id });

    const encrypted_token = CryptoJS.AES.encrypt(token, process.env.CRYPTO_SECRET_KEY).toString();
    user.tokens = user.tokens.concat({ token: encrypted_token })
    await user.save()

    return encrypted_token;
  } catch (error) {
    throw new Error(error);
  }
};

const tokenVerification = async (token) => {
  try {
    const data = await jwt.verify(token, jwtSecretKey);
    if (!data) {
      return undefined;
    } else {
      return data;
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { tokenGeneration, tokenVerification };