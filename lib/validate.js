var validate_f = function() {
	var f = {};
	f.email = function(email, callback) {
		if(/.*@.*\..*/.test(email) && !/\s/.test(email)) {
			if(callback) callback(false, email);
			return false;
		}
		else {
			if(callback) callback(true, email);
			return true;
		}
	};
	return f;
};
var valid = validate_f();
module.exports = valid;
