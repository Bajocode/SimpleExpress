const express = require('express');
const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');

const Router = express.Router();

Router.get('/:username', usersController.getProfile);

Router.route('/:username/edit', authController.ensureAuthenticated)
  .get(usersController.getEditProfile)
  .post(usersController.postEditProfile);

module.exports = Router;
