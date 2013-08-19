var express = require('express');
var path = require('path');
var signup = require('./signup');
var login = require('./login');

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
	app.post('/signup', signup(app, db));
	app.post('/login', login(app, db));
	app.all("/*", function(req, res, next) {
		db.auth(req.cookies.user, req.cookies.token, function(err) {
		if(err) {
			if(req.path == '/') {
				res.sendfile(public_path + '/index.html');
			}
			res.status(401).sendfile(public_path + '/index.html');
		} else {
			next();
		}
	})});
////////////   PRIVATE PART 
	app.get('/', function (req, res) {
		res.sendfile(public_path + '/index.html');
	});
	app.get('/partials/home.html', function (req, res) {
		res.sendfile(path.resolve(public_path + '/partials/home.html'));
	});
	app.use(function (req, res, err) {
		res.status(404).send('Not found');
	});

};

