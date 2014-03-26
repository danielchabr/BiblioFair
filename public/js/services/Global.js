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
			language: function(language) {
				if(language){
					$cookies.lang = language;
					$translate.use(language);
					return language;
				}
				return $cookies.lang;
			}
		};
	}
]);