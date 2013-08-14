var express = require('express');
var router = require('./lib/router');
var usersdb = require('./lib/usersdb');

var app = express();
usersdb.connect();

router(app, usersdb);

app.listen(process.env.PORT || 8080);

/*
   */

