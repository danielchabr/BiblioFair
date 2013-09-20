var express = require('express');
var path = require('path');
var signup = require('./signup');
var login = require('./login');
var api_old = require('./api_old');
var api = require('./api');
var auth = require('./auth');

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
	app.get('/img/*', function (req, res) { 
		res.sendfile(public_path + req.path);
	});
	app.get('/fonts/*', function (req, res) { 
		res.sendfile(public_path + req.path);
	});
	app.get('/font/*', function (req, res) { 
		res.sendfile(public_path + req.path);
	});
	app.get('/lang/*', function (req, res) { 
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
	app.get('/verify/:hash', function(req, res) {
		db.users.verify(req.params.hash, function(err) {
			if(!err) res.redirect('/login');
			else res.redirect('/login');
		});
	});
	app.all('/api/v1/*', function (req, res) {
		if(req.body.recipient) console.log(req.body.recipient);
		auth(db, req, res, api);
	});
	app.all("/*", function(req, res, next) {
		auth(db, req, res, function(err, db, req, res) {
		if(err) {
			if(req.path == '/') {
				res.sendfile(public_path + '/index.html');
			}
			else {
				res.status(401).sendfile(public_path + '/index.html');
			}
		} else {
			if(req.path == '/user') {
				res.send({id: req.cookies.id, token: req.cookies.token});
			}
			else {
				next();
			}
		}
	})});
////////////   PRIVATE PART 
	app.get('/partials/*.html', function (req, res) {
		res.sendfile(path.resolve(public_path + req.path));
	});
	
	app.use(function (req, res, err) {
		res.status(404).sendfile(public_path + '/index.html');
	});

};

