function libraryControl($rootScope, $scope, $http, $modal, $location, $filter, APIservice) {
	APIservice.books.read('','', 20, 0, function(data) {
		 $rootScope.books = data;
	});
	APIservice.library.read(function(data) {
		 $rootScope.mybooks = [];
		 for(var i = 0; i < data.library.length; i++) {
			 $rootScope.mybooks.push(data.library[i].id);
		 }
	});

	$scope.addbook = function() {
		if($scope.newbook.title && $scope.newbook.author) {
			if($scope.newbook.isbn) $scope.newbook.isbn = $scope.newbook.isbn.replace(/-/g, '');
			if($scope.newbook.isbn.length == 10) $scope.newbook.isbn = ISBN10toISBN13($scope.newbook.isbn);
			APIservice.library.create($scope.newbook, function(data, status) {
				$rootScope.mybooks.push(data);
				$scope.newbook = {};
			});
		}
	};
	///// EUROPEAN LIBRARY API ////////////
	$scope.selected_books = [];
	// on selection of one of typeaheads checks if it matches only one result and if so, fills the rest of form
	$scope.selectBook = function () {
		$scope.selected_books = $filter('filter')($scope.selected_books, $scope.newbook);
		if($scope.selected_books.length == 1) {
			$scope.newbook = $scope.selected_books[0];
		}
	};
	// is called on each change of ISBN but gives call after 10th char only
	$scope.searchTel = function (query) {
		if(query == $scope.newbook.isbn && typeof query == 'string') {
			$scope.newbook.isbn = query = query.replace(/-/g, '');
		}
		$scope.tel = [];
		if(query.length >= 10) {
			APIservice.tel.read(query, function (data) {
					for(var i = 0; i < data.Results.length; i++) {
						if(data.Results[i].TITLE && data.Results[i].CREATOR) {
							var addbook = {title: data.Results[i].TITLE[0], author: data.Results[i].CREATOR[0]};
							if(data.Results[i].SUBTITLE) addbook.subtitle = data.Results[i].SUBTITLE[0];
							if(data.Results[i].YEAR) addbook.published = data.Results[i].YEAR[0];
							if(data.Results[i].LANGUAGE) addbook.language = data.Results[i].LANGUAGE[0];
							addbook.edition = 1;
							addbook.volume = 1;
							addbook.isbn = query;
							$scope.tel.push(addbook);
						}
					}
					$scope.tel =  $filter('filter')($scope.tel, $scope.newbook, true);
					$scope.selected_books = $scope.selected_books.concat($scope.tel);
					if($scope.tel.length == 1) {
						$scope.newbook = $scope.tel[0];
					}
				});
		}
	}
	// retrieves array of wanted property in books, checks for empty slots
	$scope.check = function (data, prop) {
		var arr = [];
		if($scope.selected_books.length == 0) $scope.selected_books = $scope.books;
		var template = {};
		for (var prop in $scope.newbook) {
			template[prop] = $scope.newbook[prop];
		}
		delete template.edition;
		delete template.volume;
		var sel = $filter('filter')($scope.selected_books, $scope.newbook);
		for (var i = 0; i < sel.length;i++) {
			if(sel[i][prop]) {
				arr.push(sel[i][prop].toString());
			}
		}
		console.log($scope.newbook);
		return arr;
	};
	//////////// BOOK DETAIL MODAL //////////////////
	$scope.open = function (book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/library_detail.html',
			controller: ModalInstanceCtrl,
			resolve: {
				book: function () {
					return book;
				}
			}
		});

		modalInstance.result.then(function (action) {
			if(action == 'remove') {
				APIservice.library.del(book._id, function(data) {});
				var index = -1; index = $scope.mybooks.indexOf(book);
				if(index >= 0) $scope.mybooks.splice(index, 1);
			}
		});
	};
}
