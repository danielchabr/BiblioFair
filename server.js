'use strict';
var express = require('express');
var router = require('./lib/router');
var db = require('./lib/db');

var app = express();
db.connect();

try {
	router(app, db);
} catch (e) {
	console.log("Router error: ");
	console.log(e);
	console.log(e.stack);
}

var port = process.env.OPENSHIFT_NODEJS_PORT ||  process.env.OPENSHIFT_INTERNAL_PORT || 8080;  
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost';

try {
	app.listen(port, ipaddr);
} catch (e) {
	console.log("App.listen error: ");
	console.log(e);
	console.log(e.stack);
}

/*
   */

