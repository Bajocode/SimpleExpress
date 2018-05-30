const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const SALT_FACTOR = 10;
const noop = () => {};

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String,
});

// userSchema.methods.name = () => this.displayName || this.username;
userSchema.methods.getName = function getName() {
  return this.displayName || this.username;
};

userSchema.methods.checkPassword = function callback(guess, next) {
  bcrypt.compare(guess, this.password, (err, isMatch) => {
    next(err, isMatch);
  });
};

userSchema.pre('save', function callback(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, (errSalt, salt) => {
    if (errSalt) return callback(errSalt);

    bcrypt.hash(user.password, salt, noop, (errHash, hashedPassword) => {
      if (errHash) return next(errHash);
      user.password = hashedPassword;
      return next();
    });
    return next();
  });
  return next();
});

module.exports = mongoose.model('User', userSchema);
