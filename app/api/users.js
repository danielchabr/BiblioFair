'use strict';

var mongoose = require("mongoose"),
		config = require('../../config/config'),
        User = mongoose.model("UserModel"),
        //cryptography
        crypto = require('crypto-js'),
        //validation & errors
        validate = require("../helpers/validation"),
        errors = require("../helpers/errors"),
        //emails
        Mailgun = require('mailgun').Mailgun,
        mg = new Mailgun(config.messages.mailgun.key),
        messages = require('../helpers/messages');

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
 * Get user by their id.
 * 
 * @param {mongoose.Schema.ObjectId} id
 * @param {function} done
 * @returns {undefined}
 */

exports.getById = function(id, done) {
    User.findById(id, ['username', 'email', 'loc', 'library', 'language'].join(' ')).exec(done);
};

/**
 * Get user by their username.
 * 
 * @param {string} username
 * @param {function} done
 * @returns {undefined}
 */

exports.getByUsername = function(username, done) {
    User.findOne({username: new RegExp("^" + username + "$", "i")}, 'email language').exec(done);
};

/**
 * Get username by user's email.
 * 
 * @param {string} email
 * @param {function} done
 * @returns {undefined}
 */

exports.getUsernameByEmail = function(email, done) {
    User.findOne({email: email}, 'username', done);
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
    //TODO why??
    //res.set('Cache-Control', 'private, max-age=0, no-cache');

    //create the user
    var user = new User(data);
    user.token.hash = crypto.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString();
    user.token.last = new Date();
    user.save(function(err) {
        if(err){
            return done(err);
        }

        //no errors -> send verification email
        mg.sendText('BiblioFair <support@bibliofair.com>',
                user.email,
                messages[user.language].verification.subject,
                messages[user.language].verification.body.replace(/\{username\}/g, user.username).replace(/\{link\}/, user.token.hash),
                function(er) {
                    if(er)
                        console.log('Oh noes: ' + er);
                    else
                        console.log('New user registered');

                    done(err, user);
                });

        //TODO why??
        //res.cookie('lang', user.language, {maxAge: 18000000000, httpOnly: true});
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
            done(err);
        }
        else{
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
        }
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
            done(err);
        }
        else{
            user.password = password;
            user.save(function(err) {
                done(err, user);
            });
        }
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
            done(err);
        }
        else{
            user.language = language;
            user.save(function(err) {
                done(err, user);
            });
        }
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
            done(err);
        }
        else{
            user.verified = true;
            user.save(function(err, user) {
                done(err, user);
            });
        }
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
    User.findOne({email: email}, 'username email language password', function(err, user) {
        if(err || !user){
            done(err || "user.notFound");
        }
        else{
            var pass = crypto.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString().slice(0, 8);
            user.password = crypto.SHA3(pass,{outputLength: 256}).toString();
            user.save(function(err, user) {
                if(err){
                    return done(err);
                }
                mg.sendText('recovery@bibliofair.com',
                        user.email,
                        messages[user.language].recovery.subject,
                        messages[user.language].recovery.body.replace(/\{username\}/g, user.username).replace(/\{password\}/, pass),
                        'bibliofair.com',
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
 * Check if the user (username or email) already exists.
 * 
 * @param {string} username
 * @param {string} email
 * @param {function} done
 * @returns {undefined}
 */

exports.exists = function(username, email, done) {
    User.findOne({username: username}, function(err, user) {
        if(err || user){
            done(err || "username.exists");
        }
        else{
            User.findOne({email: email}, function(err, user) {
                if(err || user){
                    done(err || "email.exists");
                }
                else{
                    done(null, false);
                }
            });
        }
    });
};