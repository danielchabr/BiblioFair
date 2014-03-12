'use strict';

var _ = require('lodash');

//extend the defaults (all.js) with specific configuration based on environment (NODE_ENV)
module.exports = _.extend(
        require(__dirname + '/../config/env/all.js'),
        require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {}
);
