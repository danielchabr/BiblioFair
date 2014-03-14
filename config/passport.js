'use strict';

/**
 * Passport extension configuration.
 * 
 * Currently contains:
 *  - routines for serialization and deserialization of the user
 *  - local strategy
 *  
 *  TODO:
 *   - facebook auth
 *   - google auth
 * 
 * 
 */

var mongoose = require('mongoose'),
        LocalStrategy = require('passport-local').Strategy,
		FacebookStrategy = require('passport-facebook').Strategy,
        User = mongoose.model('UserModel'),
        config = require('./config');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-salt -hashedPassword', function(err, user) {
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
        User.findOne({$or: [{email: email}, {username: email}]}, function(err, user) {
            if(err){
                return done(err);
            }
            if(!user){
                return done(null, false, "user.notFound");
            }
            if(!user.authenticate(password)){
                return done(null, false, "login.failed");
            }
            return done(null, user);
        });
    }
    ));

	/**
	 * Facebook strategy.
	 */
	
	// Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
			//console.log(accessToken);
			//console.log(refreshToken);
			//console.log(profile);			
			console.log(profile);
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

};