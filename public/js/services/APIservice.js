myApp.factory('APIservice', ['$rootScope', '$http', function ($rootScope, $http) {
	var f = {};
	f.users = {
		read: function (callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token}};
			$http.get('/api/v1/users', par).success(callback);
		},
		create: function () {
			var data = { id: $rootScope.user.id, token: $rootScope.user.token};
			$http.post('/api/v1/users', data);
		},
		update: function (data, callback) {
			var data = { id: $rootScope.user.id, token: $rootScope.user.token, loc: [data.lng, data.lat]};
			$http.put('/api/v1/users', data).success(callback);
		},
		del: function () {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token}};
			$http.del('/api/v1/users', par);
		},
	};
	f.library = {
		read: function (callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token}};
			$http.get('/api/v1/library', par).success(callback);
		}
	};
	f.books = {
		read: function (fields, query, limit, offset, callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token, q: query, fields: fields, limit: limit, offset: offset}};
			$http.get('/api/v1/books', par).success(callback);
		}
	};
	return f;
}]);
