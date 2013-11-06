var express = require('express');
var path = require('path');
var fs = require('fs');
var signup = require('./signup');
var login = require('./login');
var api = require('./api');
var auth = require('./auth');

module.exports = function (app, db) {
	app.use(express.compress());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(function(req, res, next) {
		if(req.path.slice(0,3) == '/en' || req.path.slice(0,3) == '/cz') {
			req.url = req.url.slice(3);
		}
		next();
	});
	var public_path = path.resolve(__dirname + '/../public');
/////////////  PUBLIC PART
	app.use(express.favicon(public_path + '/img/favicon.ico')); 
	app.get('*', function(req, res, next){ 
		if(req.url.indexOf('?_escaped_fragment_=') != -1) {
			console.log("google bot");
			console.log(req.url);
			if(req.url.indexOf('cz') > -1) {
				res.sendfile(public_path + "/snapshot_cz.html");
			} else {
			res.sendfile(public_path + "/snapshot_en.html");
			}
		}
		else next();
	});
	app.get('*', function(req, res, next){ 
	  if(/^blog./.test(req.headers.host)) {  //if it's a sub-domain
		if(req.path == '/') {
			res.sendfile(public_path + '/blog' + '/index.html');
		} else {
			fs.stat(public_path + '/blog' + req.path, function (err, stats) {
				if(err || !stats.isFile()) next();
				else res.sendfile(public_path + '/blog' + req.path);
			});
		}
	  }
	  else next(); 
	}); 
	app.get("/partials/private/*", function(req, res, next) {
		auth(db, req, res, function(err, db, req, res) {
			if(err) {
				res.status(401).sendfile(public_path + '/index.html');
			}
			else {
				next();
			}
		});
	});
	app.get('/', function (req, res) {
		res.sendfile(public_path + '/index.html');
	});
	app.post('/signup', signup(app, db));
	app.post('/login', login(app, db));
	app.get('/verify/:hash', function(req, res) {
		db.users.verify(req.params.hash, function(err, id, token) {
			if(!err) {
				res.cookie('token', token, { maxAge: 18000000000, httpOnly: true });
				res.cookie('id', id.toString(), { maxAge: 18000000000, httpOnly: true });
				res.redirect('/');
			} else {
			}
		});
	});
	app.all('/api/v1/*', function (req, res) {
		auth(db, req, res, api);
	});
	app.all("/user", function(req, res, next) {
		auth(db, req, res, function(err, db, req, res) {
		if(err) {
			if(req.path == '/user') {
				if(req.cookies.lang) {
					res.status(401).send({lang: req.cookies.lang}); // not sending of 401 is good for testing public API
				} else {
					if(req.acceptedLanguages.indexOf('cs') > -1 || req.acceptedLanguages.indexOf('cs-cz') > -1) {
						res.cookie('lang', 'cz', { maxAge: 18000000000, httpOnly: true });
						res.status(401).send({lang: 'cz'}); 
					} else {
						res.cookie('lang', 'en', { maxAge: 18000000000, httpOnly: true });
						res.status(401).send({lang: 'en'}); 
					}
				}
			}
		} else {
			if(req.path == '/user') {
				res.send({id: req.cookies.id, token: req.cookies.token, lang: req.cookies.lang});
			}
		}
	})});
	app.all("/*", function(req, res, next) {
		fs.stat(public_path + req.path, function (err, stats) {
			if(err || !stats.isFile()) res.status(404).sendfile(public_path + '/index.html');
			else res.sendfile(public_path + req.path);
		});
	});
	app.use(function (req, res, err) {
		res.status(404).sendfile(public_path + '/index.html');
	});
};

