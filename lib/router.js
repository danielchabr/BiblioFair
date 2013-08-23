var express = require('express');
var path = require('path');
var signup = require('./signup');
var login = require('./login');
var api = require('./api');

module.exports = function (app, db) {
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	var public_path = path.resolve(__dirname + '/../public');
/////////////  PUBLIC PART
	app.use(express.favicon(public_path + '/img/favicon.ico')); 
	app.get('/login', function (req, res) {
		res.sendfile(public_path + '/index.html');
	});
	app.get('/css/*', function (req, res) {
		res.sendfile(public_path + req.path);
	});
	app.get('/js/*', function (req, res) { 
		res.sendfile(public_path + req.path);
	});
	app.get('/partials/welcome.html', function (req, res) {
		res.sendfile(public_path + '/partials/welcome.html');
	});
	app.get('/partials/404.html', function (req, res) {
		res.sendfile(public_path + '/partials/404.html');
	});
	app.post('/signup', signup(app, db));
	app.post('/login', login(app, db));
	app.post('/logout', function(req, res) {db.users.logout(req.cookies.user);});
	app.all("/*", function(req, res, next) {
		db.users.auth(req.cookies.user, req.cookies.token, function(err) { // Security - auth takes user from cookie but api works with user from path
		if(err) {
			if(req.path == '/') {
				res.sendfile(public_path + '/index.html');
			}
			else {
				res.status(401).sendfile(public_path + '/index.html');
			}
		} else {
			if(req.path == '/user') {
				res.send(req.cookies.user);
			}
			else {
				next();
			}
		}
	})});
////////////   PRIVATE PART 
	app.get('/', function (req, res) {
		res.sendfile(public_path + '/index.html');
	});
	app.get('/partials/*.html', function (req, res) {
		res.sendfile(path.resolve(public_path + req.path));
	});
	app.all('/api/:name/:service/:operation', function (req, res) {
		if(req.params.name && req.params.service && req.params.operation) {
			api(db, req.params.name, req.params.service, req.params.operation, req.body, function (resp) {
				res.send(resp);
			});
		}
	});
	app.use(function (req, res, err) {
		res.status(401).sendfile(public_path + '/index.html');
	});

};

