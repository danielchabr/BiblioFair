'use strict';

var users = require('../api/users'),
	authorization = require('./middlewares/authorization.js');

module.exports = function(app, passport) {

	/**
	 * Expose public API.
	 */

	app.post("/signup", function(req, res, next) {
		req.body.language = req.body.language || req.getLanguage();
		users.signup(req.body, function(err, data) {
			if(err){
				res.status(400);
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get("/verify/:token", function(req, res) {
		users.verify(req.params.token, function(err, data) {
			if(err){
				req.flash('error', err);
			}
			else{
				req.flash('info', 'user.verified');
			}
			res.redirect('/');
		});
	});

	app.get("/recover/:email", function(req, res, next) {
		users.recover(req.params.email, function(err, data) {
			if(err){
				res.status(404);
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get('/me', function(req, res) {
		res.send(req.user || null);
	});

	app.get("/api/users/exists/:user", function(req, res, next) {
		var user = req.params.user;
		//username
		if(user.indexOf("@") === -1){
			users.usernameExists(user, function(err, data) {
				if(err){
					return next(err);
				}
				res.send(data);
			});
		}
		//email
		else{
			users.emailExists(user, function(err, data) {
				if(err){
					return next(err);
				}
				res.send(data);
			});
		}
	});

	app.post("/api/v1/messages", function(req, res, next) {
		users.resendEmail(req.body, req.param('body-plain'), function(err, data) {
			if(err){
				next(err);
			} else{
				res.send(data);
			}
		});
	});

	/**
	 * Expose private API (user logged in).
	 */

	app.put("/api/users/location", authorization.login, function(req, res, next) {
		users.updateLocation(req.user._id, req.body.coordinates, function(err, data) {
			if(err){
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.put("/api/users/password", authorization.login, function(req, res, next) {
		users.updatePassword(req.user._id, req.body.password, function(err, data) {
			if(err){
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.put("/api/users/language", authorization.login, function(req, res, next) {
		users.updateLanguage(req.user._id, req.body.language, function(err, data) {
			if(err){
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});
	
	app.get('/send/verification', authorization.login, function(req, res, next) {
		users.sendVerification(req.user._id, function(err, data) {
			if(err){
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});
	
	app.get('/fix/usernames',authorization.login, function(req, res, next){
		users.fixUsernames(function(data){
			res.send(data);
		});
	});
	
	app.get('/api/usernames/:value',authorization.login, function(req, res, next){
		users.getUsernames(req.params.value, function(err, data){
			if(err){
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});
};
