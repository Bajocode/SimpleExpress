const express = require('express');
const app1 = require('./app1');

const app = express();

// should be /v1
app.use('', app1);

module.exports = app;
