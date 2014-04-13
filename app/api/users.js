'use strict';

var mongoose = require("mongoose"),
	config = require('../../config/config'),
	User = mongoose.model("UserModel"),
	//cryptography
	crypto = require('crypto-js'),
	//validation
	validate = require("../helpers/validation"),
	//emails
	Mailgun = require('mailgun').Mailgun,
	mg = new Mailgun(config.mail.key),
	messages = require('../helpers/messaging').messages;

/**
 * Count users in the database.
 * 
 * @param {type} done
 * @returns {undefined}
 */

exports.count = function(done) {
	User.count(function(err, data) {
		done(err, data);
	});
};

/**
 * Sign up.
 * 
 * @param {type} id
 * @param {type} location
 * @param {type} done
 * @returns {undefined}
 */

exports.signup = function(data, done) {
	var user = new User(data);
	user.provider = 'local';
	user.token.hash = crypto.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString();
	user.token.last = new Date();
	user.save(function(err) {
		if(err){
			return done(err);
		}

		mg.sendText('BiblioFair <support@bibliofair.com>',
			user.email,
			messages[user.language].emails.verification.subject,
			messages[user.language].emails.verification.body.replace(/\{username\}/g, user.username).replace(/\{link\}/, user.token.hash),
			function(er) {
				if(er)
					console.log('Oh noes: ' + er);
				else
					console.log('New user registered');

				done(err, user);
			});
	});
};

/**
 * Update user's location.
 * 
 * @param {mongoose.Schema.ObjectId} userId
 * @param {object} data
 * @param {function} done
 * @returns {undefined}
 */

exports.updateLocation = function(id, coordinates, done) {
	User.findById(id).populate('library.id', null, 'BookModel').exec(function(err, user) {
		if(err || !user){
			return done(err || "user.notFound");
		}
		for (var i = 0; i < user.library.length; i++){
			for (var j = 0; j < user.library[i].id.loc.length; j++){
				if(user.library[i].id.loc[j].coordinates[0] === user.loc.coordinates[0] && user.library[i].id.loc[j].coordinates[1] === user.loc.coordinates[1]){
					user.library[i].id.loc[j].coordinates = coordinates;
				}
				user.library[i].id.save();
			}
		}
		user.loc = {coordinates: coordinates, type: "Point"};
		user.save(function(err, user) {
			done(err, user);
		});
	});
};

/**
 * Update user's password.
 * 
 * @param {ObjectId} id User id.
 * @param {string} password New password.
 * @param {function} done Callback function.
 * @returns {undefined}
 */

exports.updatePassword = function(id, password, done) {
	User.findById(id, function(err, user) {
		if(err || !user){
			return done(err || "user.notFound");
		}
		user.password = password;
		user.save(function(err) {
			done(err, user);
		});
	});
};

/**
 * Update user's language.
 * 
 * @param {ObjectId} id User id.
 * @param {string} language
 * @param {function} done
 * @returns {undefined}
 */

exports.updateLanguage = function(id, language, done) {
	User.findById(id, function(err, user) {
		if(err || !user){
			return done(err || "user.notFound");
		}
		user.language = language;
		user.save(function(err) {
			done(err, user);
		});
	});
};

/**
 * Verify the user.
 * 
 * @param {string} token
 * @param {function} done
 * @returns {undefined}
 */

exports.verify = function(token, done) {
	User.findOne({'token.hash': token}, function(err, user) {
		if(err || !user){
			return done(err || "user.notFound");
		}
		user.verified = true;
		user.save(function(err, user) {
			done(err, user);
		});
	});
};

/**
 * Recover password for the user.
 * 
 * @param {type} email
 * @param {type} callback
 * @returns {undefined}
 * 
 **/


exports.recover = function(email, done) {
	User.findOne({email: email}, function(err, user) {
		if(err || !user){
			done(err || "user.notFound");
		}
		else{
			var pass = crypto.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString().slice(0, 8);
			var salt = "riafoilbib";
			var saltedPass = crypto.SHA3(pass + salt, {outputLength:256}).toString().substring(0, pass.length);
			user.password = saltedPass;
			user.save(function(err, user) {
				if(err){
					return done(err);
				}
				mg.sendText('recovery@bibliofair.com',
					user.email,
					messages[user.language].emails.recovery.subject,
					messages[user.language].emails.recovery.body.replace(/\{username\}/g, user.username).replace(/\{password\}/, pass),
					config.mail.server,
					function(err) {
						if(err){
							console.log('Oh noes: ' + err);
						}
						else{
							console.log('Message sent to: ' + email);
						}
						done(err, 'ok');
					});
			});
		}
	});
};

/**
 * Check if the email is already registered.
 * 
 * @param {string} email
 * @param {function} done
 * @returns {undefined}
 */

exports.emailExists = function(email, done) {
	User.findOne({email: email}, function(err, user) {
		if(err){
			return done(err);
		}
		else if(user){
			return done(null, true);
		}
		return done(null, false);
	});
};

/**
 * Check if the username exists.
 * 
 * @param {string} username
 * @param {function}
 * @returns {boolean}
 */

var usernameExists = exports.usernameExists = function(username, done) {
	User.findOne({username: username}, function(err, user) {
		if(err){
			return done(err);
		}
		else if(user){
			return done(null, true);
		}
		return done(null, false);
	});
};

/**
 * Issue token.
 */

exports.issueRememberMeToken = function(user, done) {
	user.remember = crypto.SHA3(new Date() + user.username, {outputLength: 256}).toString();
	user.save(function(err, user) {
		return done(err, user.remember);
	});
};

/**
 * Create username from email.
 * 
 * @param {string} email
 * @param {function} done
 * @returns {unresolved}
 */

exports.usernameFromEmail = function(email, done){
	var username = email.split("@")[0];
	createUniqueUsername(username, done);
};

function createUniqueUsername(username, done){
	usernameExists(username, function(exists){
		if(exists){
			username += "a";
			return createUniqueUsername(username, done);
		}
		else{
			return done(username);
		}
	});
}

