function homeControl($rootScope, $scope, $http, $modal, $location, APIservice) {
	$scope.bookOrder = 'title';
	APIservice.books.read('','', 30, 0, function(data) {
		 $rootScope.books = data
	});

	$scope.open = function (book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/book_detail.html',
			controller: ModalInstanceCtrl,
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
}

