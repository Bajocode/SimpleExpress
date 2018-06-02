const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const httpError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportConfig = require('./passportConfig');
const config = require('./config');

const app = express();
const router = require('./router');

mongoose.connect(config.dbUrl, { server: { socketOptions: { keepAlive: 120 } } });
passportConfig();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '49?4_bY!y@M4q2*2]L|f', // session encryption
  resave: true, // update session regardless of modifications
  saveUninitialized: true, // reset uninitialized sessions
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(router);

app.use((req, res, next) => {
  next(httpError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

