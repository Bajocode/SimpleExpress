const User = require('../models/User');
const passport = require('passport');

exports.getLogin = (req, res) => res.render('login');

exports.postLogin = (passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

exports.getLogout = (req, res) => {
  req.logout();
  return res.redirect('/');
};

exports.getSignup = (req, res) => res.render('signup');

exports.postSignup = ((req, res, next) => {
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
});

exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('info', 'You must be logged in to see this page');
    res.redirect('/login');
  }
};
