require('dotenv').config();
const passport = require('passport');
require('../utils/googleLogin');

const User = require('../models/User');
const { tokenGeneration } = require('../utils/jwtToken');
const { hashPassword, matchPassword } = require('../utils/hashPassword');

exports.login_get = (req, res) => {
  res.render('admin-views/login');
}

exports.login_post = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email: email, role: "admin" });
    const employee = await User.findOne({ email: email, role: "employee" });

    if (admin && admin.status === true) {
      const isMatchAdmin = await matchPassword(password, admin.password);

      if (isMatchAdmin) {
        const encrypted_token = await tokenGeneration({ id: admin.id });

        // res.cookie('token', encrypted_token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false, path: '/', sameSite: 'none'});
        res.cookie('userToken', encrypted_token, {
          expires: new Date(Date.now() + (1000 * 60 * 60 * 24)),
          httpOnly: true
        });
        res.redirect('/admin-dashboard');
      } else {
        req.flash('error', 'Email or Password Invalid');
        res.render('admin-views/login', { error_message: req.flash('error') });
      }

    } else if (employee && employee.status === true) {
      const isMatchEmployee = await matchPassword(password, employee.password);

      if (isMatchEmployee) {
        const encrypted_token = await tokenGeneration({ id: employee.id });
  
        // res.cookie('token', encrypted_token, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false, path: '/', sameSite: 'none'});
        res.cookie('userToken', encrypted_token, {
          expires: new Date(Date.now() + (1000 * 60 * 60 * 24)),
          httpOnly: true
        });
  
        res.redirect('/employee-dashboard');
      } else {
        req.flash('error', 'Email or Password Invalid');
        res.render('admin-views/login', { error_message: req.flash('error') });
      }

    } else {
      req.flash('error', 'Email or Password Invalid');
      res.render('admin-views/login', { error_message: req.flash('error') });
    }

  } catch (err) {
    res.status(501).send(err);
  }
}

exports.logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currToken) => {
        return currToken.token != req.token     // filter current token in database 
    })

    res.clearCookie('userToken'); // It is clear cookie from browser
    await req.user.save(); // Here req.user is come from authMiddleware
    res.redirect('/login');

  } catch (err) {
      res.status(500).send(err);
  }
}

exports.logoutAll = async (req, res) => {
  try {
    // For all devices
    req.user.tokens = []; // Here req.user is come from authMiddleware

    res.clearCookie('userToken'); // It is clear cookie from browser
    
    await req.user.save(); // Here req.user is come from authMiddleware
    res.redirect('/login');

  } catch (err) {
      res.status(500).send(err);
  }
}
