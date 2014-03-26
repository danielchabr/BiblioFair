angular.module('bibliofair').factory('Utils', [function() {
		return {
			/*
			 * Convert ISBN10 into ISBN13.
			 * 
			 * @param {string} isbn10 String of length 10, must be a legal ISBN10. No dashes!
			 * @returns {string} isbn10
			 */
			ISBN10toISBN13: function(isbn10) {
				if(typeof isbn10 !== 'string' || isbn10.length !== 10)
					return false;

				var sum = 38 + 3 * (parseInt(isbn10[0]) + parseInt(isbn10[2]) + parseInt(isbn10[4]) + parseInt(isbn10[6])
					+ parseInt(isbn10[8])) + parseInt(isbn10[1]) + parseInt(isbn10[3]) + parseInt(isbn10[5]) + parseInt(isbn10[7]);

				var checkDig = (10 - (sum % 10)) % 10;

				return "978" + isbn10.substring(0, 9) + checkDig;
			},
			/**
			 * Convert ISBN13 into ISBN10.
			 * 
			 * @param {string} isbn13 String of length 13, must be a legal ISBN13. No dashes!
			 * @returns {string} isbn10 ISBN10
			 */
			ISBN13toISBN10: function(isbn13) {
				if(typeof isbn13 !== 'string' || isbn13.length !== 13)
					return false;

				var start = isbn13.substring(3, 12);
				var sum = 0;
				var mul = 10;
				var i;

				for (i = 0; i < 9; i++){
					sum = sum + (mul * parseInt(start[i]));
					mul -= 1;
				}

				var checkDig = 11 - (sum % 11);
				if(checkDig === 10){
					checkDig = "X";
				} else if(checkDig === 11){
					checkDig = "0";
				}

				return start + checkDig;
			},
			/**
			 * Get username from email address (e.g. john.doe from john.doe@email.com).
			 * 
			 * @param {string} email
			 * @returns {string} username
			 */
			usernameFromEmail: function(email){
				return email.split("@")[0];
			},
			/**
			 * Encrypt password.
			 * 
			 * @param {string} password
			 * @param {string} salt (optional)
			 * @returns {string} String with the length of the given password. 
			 */
			encrypt: function(password, salt) {
				salt = salt || "riafoilbib";
				return CryptoJS.SHA3(password + salt, {outputLength:256}).toString().substring(0,password.length);
			},
		};
	}]);