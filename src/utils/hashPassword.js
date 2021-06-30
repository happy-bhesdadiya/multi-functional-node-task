const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
     const hashedPassword = await bcrypt.hash(password, 8);
     return hashedPassword;
};

const matchPassword = async (password, hashedPassword) => {
     const isMatched = await bcrypt.compare(password, hashedPassword);
     return isMatched;
};

module.exports = { hashPassword, matchPassword };