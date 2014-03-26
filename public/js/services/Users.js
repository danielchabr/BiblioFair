angular.module('bibliofair').factory('Users', ['$http', function($http, $rootScope) {
		return {
			signUp: function(user) {
				return $http.post("/signup", user);
			},
			signIn: function(user) {
				return $http.post("/signin", user);
			},
			signOut: function() {
				return $http.get("/signout");
			},
			recover: function(email) {
				return $http.get("/recover/" + email);
			},
			me: function() {
				return $http.get("/me");
			},			
			updateLanguage: function(language) {
				return $http.put("/api/users/language", {
					language: language
				});
			},
			updatePassword: function(password) {
				return $http.put("/api/users/password", {
					password: password
				});
			},
			updateLocation: function(coordinates) {
				return $http.put("/api/users/location", {
					coordinates: coordinates
				});
			},
			/** check if exists */
			exists: function(user){
				return $http.get('/api/users/exists/' + user);
			},
			emailExists: function(email){
				return $http.get('/api/users/exists/' + email);
			},
			usernameExists: function(username){
				return $http.get('/api/users/exists/' + username);
			}
		};
	}]);