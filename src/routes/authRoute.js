const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../utils/googleLogin');

const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/login', AuthController.login_get);

router.post('/login', AuthController.login_post);

router.get('/logout', authMiddleware, AuthController.logout);

router.get('/logout-all', authMiddleware, AuthController.logoutAll);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/employee-dashboard');
});

router.get('/failed', (req, res) => res.send('You are failed to login!'));

router.get('/google-logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/login');
})

module.exports = router