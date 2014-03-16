'use strict';

/**
 * Passport extension configuration.
 * 
 * Currently contains:
 *  - routines for serialization and deserialization of the user
 *  - local strategy
 *  - facebook oauth
 *  - google oauth
 * 
 */

var mongoose = require('mongoose'),
        LocalStrategy = require('passport-local').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy,
		GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
        User = mongoose.model('UserModel'),
        config = require('./config');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    /**
     * Local strategy.
     * 
     * Find the user based on email OR username and attempt to authenticate.
     */
    
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({$or: [{email: email}, {username: email}]},"+hashedPassword +salt", function(err, user) {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, "user.notFound");
            }
            if(!user.authenticate(password)){
                return done(null, false, "password.incorrect");
            }
            return done(null, user);
        });
    }
    ));

	/**
	 * Facebook strategy.
	 */
	
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'facebook.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.username,
                        provider: 'facebook',
                        facebook: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));
	
	/**
	 * Google+ strategy.
	 */
	
    passport.use(new GoogleStrategy({
            clientID: config.google.clientID,
            clientSecret: config.google.clientSecret,
            callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'google.id': profile.id
            }, function(err, user) {
                if (!user) {
					console.log(profile);
                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        username: profile.emails[0].value.split("@")[0],
                        provider: 'google',
                        google: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err);
                        return done(err, user);
                    });
                } else {
                    return done(err, user);
                }
            });
        }
    ));

};