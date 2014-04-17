'use strict';

var messages = require('../../helpers/messaging').messages;

/**
 * Authorization middleware used by routes to check if user is logged in.
 */

exports.login = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send(messages[req.cookies.lang || req.user.language || 'cz'].errors.user.notAuthenticated);
    }
    next();
};
