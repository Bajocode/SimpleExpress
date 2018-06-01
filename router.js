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

Router.route('/login')
  .get((req, res) => res.render('login'))
  .post(passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

Router.get('/logout', (req, res) => {
  req.logout();
  return res.redirect('/');
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

      return newUser.save(next);
    });
  }, passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true,
  }));

Router.get('/users/:username', (req, res, next) => {
  const { username } = req.params;
  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(404);
    return res.render('profile', { user });
  });
});

Router.route('/edit', ensureAuthenticated)
  .get((req, res) => res.render('edit'))
  .post((req, res, next) => {
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.save((err) => {
      if (err) return next(err);

      req.flash('info', 'Profile updated');
      return res.redirect('/edit');
    });
  });

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('info', 'You must be logged in to see this page');
    res.redirect('/login');
  }
}

module.exports = Router;
