'use strict';

var _ = require('lodash'),
	path = require('path'),
	root = path.normalize(__dirname + '/..');

//extend the defaults with specific configuration from '/env_config.js'
module.exports = _.extend(
	{
		root: root,
		templateEngine: 'swig',
		languages: ['cs', 'en']
	},
	require(root + '/env_config.js') || {}
);
