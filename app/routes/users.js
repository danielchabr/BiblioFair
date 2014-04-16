'use strict';

var users = require('../api/users'),
	User = require('../models/user'),
	authorization = require('./middlewares/authorization.js'),
	config = require('../../config/config'),
	Mailgun = require('mailgun').Mailgun,
	mg = new Mailgun(config.mail.key),
	messages = require('../helpers/messaging').messages;

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
		console.log(User);
		for (var prop in User) {
			console.log(User[prop]);
			console.log(prop);
		}
		User.findByEmail('xxx', function(){});
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
			users.emailExists(user, function(err, data){
				if(err){
					return next(err);
				}
				res.send(data);
			});
		}
	});

	app.post("/api/v1/messages", function(req, res, next) {
		users.resendEmail(req.body, function(err, data) {
			if(err) {
				next(err);
			} else {
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
};
