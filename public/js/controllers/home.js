function homeControl($rootScope, $scope, $http, $modal, $translate, $location, APIservice) {
	$scope.bookOrder = 'title';
	APIservice.books.read('','', 60, 0, function(data) {
		$rootScope.books = data;
	});
	//	read: function (fields, query, limit, offset, callback) {
	$scope.retrieveBooks = function () {
		APIservice.books.read('', $scope.search, 12, 0, function(data) {
			var arr = $rootScope.books.concat(data);
			$rootScope.books = uniqBooks(arr);
		});
	}
	var uniqBooks = function (arr) {
		var arr = arr.sort(function(a, b) { if(a._id < b._id) return -1; else if (a._id > b._id) return 1; else return 0; });
		var res = [];
		for(var i = 0; i < arr.length; i++) {
			if(arr[i+1] == undefined || arr[i]._id != arr[i+1]._id) {
				res.push(arr[i]);
			}
		}
		return res;
	};

	$scope.open = function (book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/private/book_detail.html',
			controller: ModalBookCtrl,
			resolve: {
				book: function () {
					return book;
				}
			}
		});

		modalInstance.result.then(function () {
		}, function () {
		});
	};
	///// pagination
	$scope.currentPage = 1;
	$scope.pageSize = 12;
}
myApp.filter('paginationShift', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});

