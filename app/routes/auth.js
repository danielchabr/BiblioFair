'use strict';

var crypto = require('crypto-js'),
	users = require('../api/users');

module.exports = function(app, passport) {

	/**
	 * Sign the user out.
	 */

	app.get('/signout', function(req, res) {
		var user = req.user;
		user.remember = undefined;
		user.save(function(err) {
			req.logout();
			res.redirect('/');
		});
	});


	/**
	 * Local sign in.
	 */

	app.post('/signin', function(req, res, next) {
		var remember = req.body.remember;
		passport.authenticate('local', function(err, user, info) {
			if(err){
				return next(err);
			}
			else if(!user){
				res.status(401);
				next(info);
			}
			else{
				req.user = user;
				if(remember){
					users.issueRememberMeToken(user, function(err, token) {
						if(err){
							return next(err);
						}
						res.cookie('remember_me', token, {path: '/', httpOnly: true, maxAge: 604800000});
						return next();
					});
				}
				else{
					return next();
				}
			}
		})(req, res, next);
	}, function(req, res, next) {
		var user = req.user;

		//delete sensitive info
		user.salt = undefined;
		user.hashedPassword = undefined;

		//login
		req.logIn(user, function(err) {
			if(err){
				return next(err);
			}
			res.status(200).send(user);
		});
	});

	/**
	 * Facebook oauth.
	 */

	app.get('/signin/facebook', function(req, res, next) {
		passport.authenticate('facebook', {
			scope: ['email']
		})(req, res, next);
	});


	app.get('/signin/facebook/callback', function(req, res, next) {
		passport.authenticate('facebook', function(err, user) {
			if(err){
				resolveOauthError(err, req, res);
			}

			else if(!user){
				var reason = req.query.error_reason,
					message;
				switch (reason) {
					case 'user_denied':
						message = 'facebook.userDenied';
						break;
					default:
						message = "facebook.error";
				}
				resolveOauthError(message, req, res);
			}


			req.logIn(user, function(err) {
				if(err){
					return resolveOauthError(err, req, res);
				}
				res.redirect('/');
			});
		})(req, res, next);
	});

	/**
	 * Google oauth.
	 */

	app.get('/signin/google', function(req, res, next) {
		passport.authenticate('google', {
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			]
		})(req, res, next);
	});


	app.get('/signin/google/callback', function(req, res, next) {
		passport.authenticate('google', function(err, user) {
			if(err){
				return resolveOauthError(err, req, res);
			}

			else if(!user){
				var reason = req.query.error,
					message;
				switch (reason) {
					case 'access_denied':
						message = 'google.accessDenied';
						break;
					default:
						message = "google.error";
				}
				return resolveOauthError(message, req, res);
			}

			req.logIn(user, function(err) {
				if(err){
					return resolveOauthError(err, req, res);
				}
				res.redirect('/');
			});
		})(req, res, next);
	});
};

function resolveOauthError(error, req, res) {
	req.flash('error', error);
	return res.redirect('/');
}