const express = require('express');
const User = require('./models/User');

const Router = express.Router();

Router.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash('error');
  res.locals.infos = req.flash('info');
  next();
});

Router.get('/', (req, res, next) => {
  User.find()
    .sort({ createdAt: 'descending' })
    .exec((err, users) => {
      if (err) return next(err);
      return res.render('index', { users });
    });
});

// Router.route('/signup')
//   .get((req, res) => res.render('signup'))
//   .post((req, res) => res.redirect('/signup'));

module.exports = Router;
