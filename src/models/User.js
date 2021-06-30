const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullname: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String
  },
  role: {
      type: String,
      required: true
  },
  status: {
      type: Boolean,
      required: true
  },
  tokens: [{
      token: {
          type: String,
          required: true,
      }
  }]
})

const User = mongoose.model('User', userSchema);

module.exports = User