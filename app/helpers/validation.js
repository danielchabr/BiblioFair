'use strict';

var https = require('https');

exports.emaila = function(email, done) {
	var options = require('url').parse('https://api.mailgun.net/v2/address/validate?address=' + email);
	options.auth = 'api:pubkey-9heydu31nykpybbupnrza9dmib09nd-7';
	https.get(options, function(response) {
		var data = "";
		response.on('data', function(i) {
			data += i;
		});
		response.on('end', function() {
			done(null, JSON.parse(data).is_valid);
		});
		response.on('error', function(e) {
			done(e);
		});
	});
};

exports.presenceOf = function(value) {
	return value && value.length;
};


var regex = exports.regex = {
	email: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
	//email: /^[^@\s]+@[^@\s]+\.[a-z]{2,10}$/i,
	//username: /^[^@\s]+$/
	//username: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))$/
	//email: /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
	//username: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)
};

exports.email = function(email, done) {
	return done(null, regex.email.test(email));
};