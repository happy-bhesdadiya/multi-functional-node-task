const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../utils/googleLogin');

const EmployeeController = require('../controllers/EmployeeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { tokenGeneration } = require('../utils/jwtToken');

const isLoggedIn = async (req, res, next) => {
  if (req.user) {
    const encrypted_token = await tokenGeneration({ id: req.user._id });
    
    res.cookie('userToken', encrypted_token, {
      expires: new Date(Date.now() + (1000 * 60 * 60 * 24)),
      httpOnly: true
    });
    next()
  } else {
    res.redirect('/login')
  }
}

router.get('/employee-dashboard', isLoggedIn, authMiddleware, EmployeeController.employee_dashboard_get);


router.get('/dashboard', isLoggedIn, EmployeeController.dashboard_get);

module.exports = router