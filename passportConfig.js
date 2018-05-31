const passport = require('passport');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;

/* eslint no-underscore-dangle: 0 */
module.exports = () => {
  passport.serializeUser((user, next) => next(null, User._id));
  passport.deserializeUser((id, next) => User.findBy(id, (err, user) => next(err, user)));
};


passport.use('login', new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (queryErr, foundUser) => {
    if (queryErr) return next(queryErr);
    if (!foundUser) return next(null, false, { message: 'Username not found' });

    return foundUser.checkPassword(password, (passErr, isMatch) => {
      if (passErr) return next(passErr);
      return isMatch ? next(null, foundUser) : next(null, false, { message: 'invalid password' });
    });
  });
}));

