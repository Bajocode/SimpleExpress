const express = require('express');
const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.use(indexController.storeCurrentUser);
Router.get('/', indexController.getIndex);

Router.route('/login')
  .get(authController.getLogin)
  .post(authController.postLogin);

Router.get('/logout', authController.getLogout);

Router.route('/signup')
  .get(authController.getSignup)
  .post(authController.postSignup, authController.postLogin);

module.exports = Router;
