var express = require('express');
var router = require('./lib/router');
var usersdb = require('./lib/usersdb');

var app = express();
usersdb.connect();

router(app, usersdb);

var port = process.env.OPENSHIFT_NODEJS_PORT ||  process.env.OPENSHIFT_INTERNAL_PORT || 8080;  
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost';

app.listen(port, ipaddr);

/*
   */

