function homeControl($rootScope, $scope, $http, $modal, $translate, $location, APIservice) {
	$scope.bookOrder = 'title';
	APIservice.books.read('','', 30, 0, function(data) {
		$rootScope.books = data
	});

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
	$scope.currentPage = 1;
	$scope.pageSize = 12;
}
myApp.filter('paginationShift', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});

