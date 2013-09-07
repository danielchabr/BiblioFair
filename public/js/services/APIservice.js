myApp.factory('APIservice', ['$rootScope', '$http', function ($rootScope, $http) {
	var f = {};
	f.users = {
		read: function () {
			$http.get();
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
			var par = { params: { user: $rootScope.user, q: query}};
			$http.get('/api/v1/books', par);
		}
	};
	return f;
}]);
