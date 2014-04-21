'use strict';

/**
 * Express configuration.
 */

var express = require('express'),
	fs = require('fs'),
	config = require('./config'),
	flash = require('connect-flash'),
	consolidate = require('consolidate'),
	messaging = require("../app/helpers/messaging"),
	localization = require("../app/helpers/localization"),
	subdomains = require('express-subdomains');

module.exports = function(app, passport) {
	app.set('showStackError', true);
	app.locals.pretty = true;
	// cache needs to be in the 'memory mode' otherwise swig dies in NODE_ENV=production
	app.locals.cache = 'memory';
	
	// place before express.static to make sure all assets and data are compressed
	app.use(express.compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		// slowest, best compression
		level: 9
	}));

	// assign the template engine to .html files
	app.engine('html', consolidate[config.templateEngine]);
	app.set('view engine', 'html');
	app.set('views', config.root + '/app/views');

	app.configure(function() {
		// the cookieParser should be above session
		app.use(express.cookieParser('supersecret lotr'));

		// request body parsing middleware should be above methodOverride
		app.use(express.urlencoded());
		app.use(express.json());
		app.use(express.methodOverride());

		app.use(express.session({secret: 'keyboard cathrine'}));

		//get && set language methods
		app.use(function(req, res, next) {
			req.getLanguage = localization.getLanguage;
			res.setLanguage = localization.setLanguage;
			next();
		});

		// use passport session
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(passport.authenticate('remember-me'));

		// flash messages
		app.use(flash());

		//all the directories in the '/public' directory should serve the files
		//everything else will be handled in the router
		var publicPath = config.root + '/public';
		fs.readdirSync(publicPath).forEach(function(file) {
			var filePath = publicPath + '/' + file;
			if(fs.statSync(filePath).isDirectory()){
				app.use('/' + file, express.static(filePath));
			}
		});

		//favicon
		app.use(express.favicon(publicPath + '/img/favicon.ico'));

		// routes should be at the last
		subdomains.use('blog').use('press');
		app.use(subdomains.middleware);
		app.use(app.router);

		//error handling
		app.use(function(err, req, res, next) {
			if(res.statusCode < 300){
				res.status(500);
			}
			//console.log(messaging.normalizeError(err, req.getLanguage()));
			console.log(err);
			res.send(messaging.normalizeError(err, req.getLanguage()));
		});
	});
};
