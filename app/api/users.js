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

var regex = function(s) {
	return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

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
		return sendVerification(user._id, done);
	});
};

/**
 * Send verification.
 */

var sendVerification = exports.sendVerification = function(userId, done) {
	User.findById(userId, function(err, user) {
		if(err || !user){
			return done(err || "user.notFound");
		}

		mg.sendText('BiblioFair <support@bibliofair.com>',
			user.email,
			messages[user.language].emails.verification.subject,
			messages[user.language].emails.verification.body.replace(/\{username\}/g, user.username).replace(/\{link\}/, user.token.hash),
			config.mail.server,
			function(er) {
				if(er)
					console.log('Oh noes: ' + er);
				else
					console.log('Verification sent!');
				done(err, user);
			});
	});
};

/**
 * Update user's location.
 * 
 * @param {mongoose.Schema.ObjectId} userId
 * @param {object} coordinates
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
			var saltedPass = crypto.SHA3(pass + salt, {outputLength: 256}).toString().substring(0, pass.length);
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
	var re = new RegExp('^' + regex(username) + '$', 'i');
	User.findOne({username: re}, function(err, user) {
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

exports.usernameFromEmail = function(email, done) {
	var username = email.split("@")[0];
	createUniqueUsername(username, done);
};

function createUniqueUsername(username, done) {
	usernameExists(username, function(exists) {
		if(exists){
			username = makeUsernameUnique(username);
			return createUniqueUsername(username, done);
		}
		else{
			return done(username);
		}
	});
}

function makeUsernameUnique(username) {
	return username + "1";
}

/*
 * Resend email
 *
 * @param {object} email
 */

exports.resendEmail = function(email, emailBody, done) {
	if(email.recipient && email.sender){
		var to = email.recipient.split('@')[0];
		User.findByUsername(to.toLowerCase(), function(err, to) {
			if(err || !to){
				return done(err);
			}
			User.findByEmail(email.sender.toLowerCase(), function(err, from) {
				if(err || !from){
					return done(err);
				}
				if(to.email === email.sender.toLowerCase()){
					return done(messages['en'].errors.messaging.fromEqualsTo);
				}
				//save message
				from.messages.push({to: to._id, text: emailBody});
				to.messages.push({from: from._id, text: emailBody});
				from.save();
				to.save();

				//send the email
				var fromEmail = from.username + '@' + config.mail.server;
				mg.sendText(fromEmail,
					to.email,
					email.subject,
					emailBody + messages[to.language || 'cs'].emails._explanation.replace(/\{recipient\}/, fromEmail),
					config.mail.server,
					function(err) {
						if(err){
							done(err);
						}
					}
				);
				done(null);
			});
		});
	}
};

/**
 * Fix usernames.
 */

var validate = require('../helpers/validation'),
	async = require('async');

exports.identifyInvalidUsnernames = function(done) {
	User.find(function(err, data) {
		async.eachSeries(data,
			//do this for each item in the array
				function(user, callback) {
					var username = user.username;
					validate.email(username + "@bibliofair.com", function(err, valid) {
						if(err){
							return callback(err);
						}
						
						//an invalid username!
						if(valid === false){
							user.oldUsername = user.username;
							//TODO - replace invalid chars
							//user.username = user.username.removeDiacritics();
						}
						callback();
					});
				},
				//once the whole array has been looped trhough
					function() {
						done(data);
					});
			});
	};
	
exports.fixInvalidUsernames = function(){
	//TODO how to find documents WITH certain field filled
	User.find({oldUsername:!undefined}, function(){
		
	});
};

exports.getUsernames = function(value, done){
	var regex = new RegExp(value, "gi");
	User.find({username: regex},{username:1},function(err, users){
		done(err, users);
	});
};
