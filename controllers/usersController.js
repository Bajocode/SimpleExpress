const User = require('../models/User');

exports.getProfile = (req, res, next) => {
  const { username } = req.params;

  User.findOne({ username }, (err, user) => {
    if (err) return next(err);
    if (!user) return next(404);
    return res.render('profile', { user });
  });
};

exports.getEditProfile = (req, res) => res.render('edit');

exports.postEditProfile = (req, res, next) => {
  const { username } = req.params;

  User.findOne({ username }, (searchErr, user) => {
    if (searchErr) return next(searchErr);
    if (!user) return next(404);

    const foundUser = user;
    foundUser.displayName = req.body.displayName;
    foundUser.bio = req.body.bio;

    return foundUser.save((saveErr) => {
      if (saveErr) return next(saveErr);

      req.flash('info', 'Profile updated');
      return res.redirect(req.originalUrl);
    });
  });
};
