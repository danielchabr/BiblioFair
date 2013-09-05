function homeControl($rootScope, $scope, $http, $modal, $location) {
	$scope.bookOrder = 'title';
	queryBooks($rootScope, $scope, $http, $location);

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

