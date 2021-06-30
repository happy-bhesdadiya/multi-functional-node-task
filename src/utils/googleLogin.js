const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRETE,
    callbackURL: process.env.CALLBACKURL
  },
  async (accessToken, refreshToken, profile, done) => {
    // ------ If you are using User database and store details (profile.id contains id, name, email etc. of  particular user ) ------
   
    const user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      return done(null, user); 
    } else {
      User.create({ fullname: profile.displayName, email: profile.emails[0].value, role: 'employee', status: true }, async (err, user) => {
        // console.log(user);
  
        return done(err, user);
      });
    }


    // ------------ Here is without database ----------------
    // return done(null, profile);
  }
));

// ------ If you are using User database and store details (user.id contains id, name, email etc. of  particular user ) ------

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });

// ------------- Here is without database user -------------------

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
