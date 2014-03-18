'use strict';

//Global service for global variables
angular.module('bibliofair').factory('Global', ['$translate', '$cookies',
	function($translate, $cookies) {
		return{
			user: function() {
				return window.user;
			},
			authenticated: function() {
				return !!window.user;
			},
			encrypt: function(password) {
				return CryptoJS.SHA3(password, {outputLength: 256}).toString();
			},
			language: function(language) {
				if(language){
					$cookies.lang = language;
					$translate.uses(language);
					return language;
				}
				return $cookies.lang;
			}
		};
	}
]);