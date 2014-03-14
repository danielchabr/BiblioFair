'use strict';

/**
 * Authorization middleware used by routes to check if user is logged in.
 */

exports.login = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send('User is not authorized');
    }
    next();
};