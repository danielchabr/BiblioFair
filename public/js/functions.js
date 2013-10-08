function queryMyBooks ($rootScope, $scope, $http, $location) {
	console.log('deprecated');
	$http.get('/api/' + $scope.user + '/users/queryBooks')
		.success( function(data) {
			$rootScope.mybooks = [];
			for (var i = 0; i < data.length; i++) {
				var book = {};
				book = data[i];
				$rootScope.mybooks.push(book);
			}
		});
};
function queryBooks ($rootScope, $scope, $http, $location) {
	console.log('deprecated');
	$http.get('/api/' + $scope.user + '/books/query')
		.success( function(data) {
			$rootScope.books = [];
			for (var i = 0; i < data.length; i++) {
				var book = {};
				book = data[i];
				$rootScope.books.push(book);
			}
		});
};
function removeBook ($rootScope, $scope, $http, $location, book) {
	console.log('deprecated');
	$http.post('/api/' + $scope.user + '/users/removeBook', book)
		.success( function(data) {
		});
};

