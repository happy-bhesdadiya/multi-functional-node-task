require('dotenv').config();
require('./db/db');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');     // Used for displaying flash message
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const cookieSession = require('cookie-session');

const authRoute = require('./routes/authRoute');
const adminRoute = require('./routes/adminRoute');
const employeeRoute = require('./routes/employeeRoute');

const app = express();

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");

app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({extended: false }));

app.use(cors());
app.use(morgan("dev"));

app.use(cookieParser());

app.use(session({ secret: 'secretsession', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(flash());

// app.use(cookieSession({
//   name: 'google-auth-session',
//   keys: ['key1', 'key2'],
//   expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) // 1 Day
// }))

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.use(authRoute);
app.use(adminRoute);
app.use(employeeRoute);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});