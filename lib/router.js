var express = require('express');
var path = require('path');
var signup = require('./signup');
var login = require('./login');

module.exports = function (app, usersdb) {
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.cookieParser());

	var public_path = path.resolve(__dirname + '/../public');

	app.use(express.favicon(public_path + '/img/favicon.ico')); 
	app.use('/login', express.static(public_path));
	app.use('/css', express.static(public_path + '/css'));
	app.use('/js', express.static(public_path + '/js'));
	app.get('/partials/welcome.html', function (req, res) {
		res.sendfile(public_path + '/partials/welcome.html');
	});
	app.post('/signup', signup(app, usersdb));
	app.post('/login', login(app, usersdb));
	app.all("/*", function(req, res, next) {
		console.log(req.path);
		if(req.cookies && req.cookies.user) {
			console.log("Welcome " + req.cookies.user);
			next();
		} else {
			console.log("not_auth");
			res.redirect("/login"); 
		}});
	app.get('/partials/home.html', function (req, res) {
		res.sendfile(path.resolve(public_path + '/partials/home.html'));
	});
	app.use(function (req, res, err) {
		console.log(req.cookies.user);
		res.redirect('/login');
		console.log(req.path);
	});

};  // semicolon??

