const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const httpError = require('http-errors');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const IndexRouter = require('./routes/IndexRouter');

mongoose.connect('mongodb://localhost:27017/test');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', IndexRouter);

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

