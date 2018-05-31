const express = require('express');
const User = require('./models/User');
const passport = require('passport');

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

Router.route('/signup')
  .get((req, res) => res.render('signup'))
  .post((req, res, next) => {
    const { username } = req.body;
    const { password } = req.body;

    User.findOne({ username }, (err, user) => {
      if (err) return next(err);
      if (user) {
        req.flash('error', 'User already exists');
        return res.redirect('/signup');
      }

      const newUser = new User({ username, password });

      newUser.save(next);
      return res.redirect('/signup');
    });
  });

Router.get('/users/:username', (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(404);
    return res.render('profile', { user });
  });
});

module.exports = Router;
