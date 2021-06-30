require('dotenv').config();
require('../db/db');
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Read json file
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));

// Import Sample Data In DB
const importData = async () => {
  
  try {
    
    let data = [];
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      user.password = await bcrypt.hash(user.password, 8)
      data.push(user)
    }
    
    await User.create(data);
    console.log(`Data successfully imported`);
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

// Delete the data from DB
const deleteData = async () => {
  try {
      await User.deleteMany();
      console.log(`Data successfully deleted`);
      process.exit();
  } catch (err) {
      console.log(err);
  }
}

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}