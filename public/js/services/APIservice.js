myApp.factory('APIservice', ['$rootScope', '$http', function ($rootScope, $http) {
	var f = {};
	f.users = {
		read: function () {
			var par = { params: { user: $rootScope.user, fields: 'loc'}};
			$http.get('/api/v1/users', par);
		},
		create: function () {
			$http.post();
		},
		update: function () {
			$http.put();
		},
		del: function () {
			$http.del();
		},
	};
	f.books = {
		get: function (query) {
			var par = { params: { user: $rootScope.user, q: query, fields: 'loc'}};
			$http.get('/api/v1/books', par);
		}
	};
	return f;
}]);
