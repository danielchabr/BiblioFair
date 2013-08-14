var express = require('express');
var signup = require('./signup');
var login = require('./login');

module.exports = function (app, usersdb) {

	app.use(express.compress());
	app.use(express.bodyParser());

	app.use(express.static(__dirname + './../public/'));
	app.post('/signup', signup(app, usersdb));
	app.post('/login', login(app, usersdb));
	app.use(function (req, res, err) {
		res.redirect('/');
		console.log(req.path);
	});

};  // semicolon??

