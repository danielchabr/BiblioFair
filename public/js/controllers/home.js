function homeControl($rootScope, $scope, $http, $modal, $translate, $location, APIservice) {
	$.getScript("http://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluub250r2g%2Caa%3Do5-9u8wl4");
	$scope.bookOrder = 'title';
	APIservice.users.read(function(data) {
		if(data.loc.coordinates.length == 2) {
			$scope.lat = data.loc.coordinates[1];
			$scope.lng = data.loc.coordinates[0];
		}
		APIservice.books.read('', '', 60, 0, $scope.lat, $scope.lng, 10000 , function(data) {
			if(data){
				$rootScope.books=[];
				for(var i = 0; i < data.length; i++) {
					data.distance = i;
					$rootScope.books.push(data[i]);
				}
				$rootScope.books = uniqBooks($rootScope.books, function(a, b) { if(a._id < b._id) return -1; else if (a._id > b._id) return 1; else return 0; });
				console.log(data.length);
			}
		});
	});
	$scope.bookOrder = "distance";
	//	read: function (fields, query, limit, offset, callback) {
	$scope.retrieveBooks = function () {
		APIservice.books.read('', $scope.search, 12, 0, function(data) {
			var arr = $rootScope.books.concat(data);
			$rootScope.books = uniqBooks(arr, function(a, b) { if(a._id < b._id) return -1; else if (a._id > b._id) return 1; else return 0; });
		});
	}
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
	//// Google Analytics
	ga('create', 'UA-43562427-1', 'bibliofair.com');
	ga('send', 'pageview');
}
myApp.filter('paginationShift', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});

