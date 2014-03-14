'use strict';

var users = require("../api/users"),
		authorization = require('./middlewares/authorization.js'),
		errors = require("../helpers/errors");

module.exports = function(app, passport) {

	/**
	 * Expose public API.
	 */

	app.post("/signup", function(req, res) {
		users.signup(req.body, function(err, data) {
			if(err){
				res.status(400).send(errors.normalize(err, req.body.language));
			}
			else{
				res.send(data);
			}
		});
	});

	app.post('/signin', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if(err){
				return next(err);
			}
			else if(!user){
				return res.status(401).send(errors.normalize(new Error(info), req.body.language))
			}
			else{
				req.logIn(user, function(err) {
					if(err){
						return next(err);
					}
					res.status(200).send('ok');
				});
			}
		})(req, res, next);
	});

	app.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get("/verify/:token", function(req, res) {
		users.verify(req.params.token, function(err, data) {
			if(err){
				res.status(404).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get("/recover/:email", function(req, res) {
		users.recover(req.params.email, function(err, data) {
			if(err){
				res.status(404).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get('/me', function(req, res) {
		res.send(req.user || null);
	});

	/**
	 * Expose private API (user logged in).
	 */

	app.put("/api/users/location", authorization.login, function(req, res) {
		users.updateLocation(req.user._id, req.body.coordinates, function(err, data) {
			if(err){
				res.status(500).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.put("/api/users/password", authorization.login, function(req, res) {
		users.updatePassword(req.user._id, req.body.password, function(err, data) {
			if(err){
				res.status(500).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.put("/api/users/language", authorization.login, function(req, res) {
		users.updateLanguage(req.user._id, req.body.language, function(err, data) {
			if(err){
				res.status(500).send(err);
			}
			else{
				res.send(data);
			}
		});
	});


	app.get("/api/users/count", function(req, res) {
		users.count(function(err, data) {
			if(err){
				res.status(500).send(err);
			}
			else{
				res.send(data.toString());
			}
		});
	});

	app.get("/api/users/:id", function(req, res) {
		users.getById(req.params.id, function(err, data) {
			if(err){
				res.status(404).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get("/api/users/username/:username", function(req, res) {
		users.getByUsername(req.params.username, function(err, data) {
			if(err){
				res.status(404).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get("/api/users/email/:email", function(req, res) {
		users.getById(req.params.email, function(err, data) {
			if(err){
				res.status(404).send(err);
			}
			else{
				res.send(data);
			}
		});
	});

	/**
	 * 3rd party authentication.
	 */

	// Setting the facebook oauth routes
	app.get('/auth/facebook', function(req, res, next) {
		passport.authenticate('facebook', {
			scope: ['email']
		})(req, res, next);
	});


	app.get('/auth/facebook/callback', function(req, res, next) {
		passport.authenticate('facebook', function(err, user) {
			req.logIn(user, function(err) {
				if(err){
					return next(err);
				}
				res.redirect('/');
			});
		})(req, res, next);
	});
};