var https = require('https');

var validate_f = function() {
	var f = {};
	f.email = function(email, callback) {

		var options = require('url').parse('https://api.mailgun.net/v2/address/validate?address=' + email);
		options.auth = 'api:pubkey-9heydu31nykpybbupnrza9dmib09nd-7';
		https.get(options, function (response) {
			var all_data = "";
				response.on('data', function(data) {
					all_data += data;
					});
				response.on('end', function() {
					callback(!JSON.parse(all_data).is_valid);
					});
				response.on('error', function(e) {
					console.log(e);
					callback(true);
					});
				});
	};
	return f;
};
var valid = validate_f();
module.exports = valid;
