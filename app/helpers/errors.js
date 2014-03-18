var util = require('util'),
        messages = require("./messages");

/**
 * Normalizes and translates given errors into human readable form.
 * 
 * @param {type} error Received error
 * @param {type} language
 * @returns {object} Initial error or normalized errors.
 */

exports.normalize = function(error, language) {
	language = language || 'en';
	var errors = [];
	/**
	 * Error normalization.
	 */

	//custom errors like "user.notFound"
	if(typeof (error) === "string"){
		var e = error.split(".");
		errors.push({
			path: e[0],
			type: e[1]
		});
	}

	//Mongoose validation errors
	else if(error.name === "ValidationError"){
		//loop through the individual errors
		Object.keys(error.errors).forEach(function(key) {
			var e = error.errors[key];
			//'user exists', 'email invalid' etc. (custom validators)
			if(e.type === "user defined"){
				errors.push({
					path: e.path,
					type: e.message
				});
			}
			//'username' required etc. (Mongoose built-in validators)
			else{
				errors.push({
					path: e.path,
					type: e.type
				});
			}
		});
	}

	//errors created by calling sth like new Error('user.notFound')
	else if(error.message){
		var e = error.message.split(".");
		errors.push({
			path: e[0],
			type: e[1]
		});
	}

	else{
		return error;
	}

	/**
	 * Attempt tranlsation.
	 */

	var failed = false;
	errors.forEach(function(e) {
		try {
			var message = messages[language]['errors'][e.path][e.type];
			if(message){
				e.message = message;
			}
			else{
				failed = true;
			}
		} catch (e) {
			failed = true;
		}
	});

	/**
	 * If none of the translations failed, return the normalized errors,
	 * otherwise return the original error.
	 */

	return failed ? error : {
		normalized: true,
		errors: errors
	};
}