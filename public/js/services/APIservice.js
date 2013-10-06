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
			if(data.action && data.action == 'recover') {
				var data = { action: 'recover', email: data.email};
			}
			else if(data.action && data.action == 'loc') {
				var data = { id: $rootScope.user.id, token: $rootScope.user.token, action: 'loc', loc: [data.lng, data.lat]};
			}
			else if(data.action && data.action == 'pass') {
				var data = { id: $rootScope.user.id, token: $rootScope.user.token, action: 'pass', old_password_username: data.old_password_username, old_password_email: data.old_password_email, password_username: data.password_username, password_email: data.password_email};
			}
			else {
				console.log('user update error');
			}
			$http.put('/api/v1/users', data).success(callback).error(callback);
		},
		del: function (callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token}};
			$http['delete']('/api/v1/users', par).success(callback);
		}
	};
	f.library = {
		read: function (callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token}};
			$http.get('/api/v1/library', par).success(callback);
		},
		create: function (book, callback) {
			var data = { id: $rootScope.user.id, token: $rootScope.user.token, book: book};
			$http.post('/api/v1/library', data).success(callback);
		},
		del: function (bookId, callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token, book: bookId}};
			$http['delete']('/api/v1/library', par).success(callback);
		}
	};
	f.books = {
		read: function (fields, query, limit, offset, callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token, q: query, fields: fields, limit: limit, offset: offset}};
			$http.get('/api/v1/books', par).success(callback);
		},
		readById: function (bookId, callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token}};
			$http.get('/api/v1/books/' + bookId, par).success(callback);
		}
	};
	f.tel = {
		read: function (query, callback) {
			var par = { params: { id: $rootScope.user.id, token: $rootScope.user.token, q: query}};
			$http.get('/api/v1/tel', par).success(callback);
		}
	};
	f.messages = {
		send: function (userTo, sender, userFrom, book, callback) {
			var subject = 'Book request';
			var body = ['Hello ' + userTo + '!',
				'User ' + userFrom + ' would like to buy a book from you. If you are intereseted reply to this message and arrange details of the deal directly with him.',
				'Details of requested book:',
				'Title: ' + book.title,
				'Author: ' + book.author,
				'\nBest regards,',
				'BiblioFair team'
				].join('\n');
			var recipient = userTo + '@bibliofair.com';
			var data = { id: $rootScope.user.id, token: $rootScope.user.token, recipient: recipient, sender: sender, subject: subject, 'body-plain': body};
			$http.post('/api/v1/messages', data).success(callback);
		}
	};
	return f;
}]);
