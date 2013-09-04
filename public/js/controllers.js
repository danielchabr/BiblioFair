function loginControl($rootScope, $scope, $http, $location, $translate) {
	$scope.log = function (l) { console.log(l);};
	$scope.signup = function() {
		if($scope.signup_email && $scope.signup_password.length > 5) {
			hash = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
			$http.post('/signup', {'email': $scope.signup_email, 'password': hash.toString()})
				.success( function(data) {
					if(data == 'registered') {
						$scope.signup_message = $translate('WELCOME.VERIFICATION_SENT') + $scope.signup_email;
					}
					else {
						$scope.signup_message = $translate('WELCOME.EXISTS');
					}
				});
		} else {
			if($scope.signup_password.length < 6) {
				$scope.signup_message = $translate('WELCOME.SHORT_PASSWORD');
			}
		}
	}
	$scope.login = function() {
		if($scope.login_email && $scope.login_password.length > 5) {
			hash = CryptoJS.SHA3($scope.login_password + $scope.login_email, {outputLength: 256 });
			$http.post('/login', {'email': $scope.login_email, 'password': hash.toString()})
				.success( function(data) {
					if(data == 'loginSuccess') {
						$rootScope.user = $scope.login_email;
						$location.path('/');
					}
					else {
						$scope.login_message = $translate('WELCOME.AGAIN');
					}
				})
			.error( function(data) {
				$scope.message = $translate('WELCOME.AGAIN');
			});
		} else {
			if($scope.login_password.length < 6) {
				$scope.login_message = $translate('WELCOME.SHORT_PASSWORD');
			}
		}
	}
}
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
var ModalInstanceCtrl = function ($scope, $modalInstance, book) {
	$scope.details_view = book;
	$scope.remove = function () {
		$modalInstance.close('remove');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
function libraryControl($rootScope, $scope, $http, $modal, $location, $filter) {
	queryMyBooks($rootScope, $scope, $http, $location);
	queryBooks($rootScope, $scope, $http, $location);

	$scope.addbook = function() {
		if($scope.newbook.title && $scope.newbook.author) {
			if($scope.newbook.isbn) $scope.newbook.isbn = $scope.newbook.isbn.replace(/-/g, '');
			if($scope.newbook.isbn.length == 10) $scope.newbook.isbn = ISBN10toISBN13($scope.newbook.isbn);
			$http.post('/api/' + $scope.user + '/books/add', $scope.newbook)
				.success( function(data) {
					var book = $scope.newbook;
					$rootScope.mybooks.push(book);
					$rootScope.books.push(book);
					$scope.newbook = {};
				})
			.error( function(data) {
			});
		}
	};
	///// EUROPEAN LIBRARY API ////////////
	$scope.selected_books = [];
	// on selection of one of typeaheads checks if it matches only one result and if so, fills the rest of form
	$scope.selectBook = function () {
		$scope.selected_books = $filter('filter')($scope.selected_books, $scope.newbook);
		console.log($scope.selected_books);
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
			$http.get('/api/' + $scope.user + '/tel/' + query)
				.success( function (data) {
					console.log(data);
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
					console.log($scope.tel);
					$scope.tel =  $filter('filter')($scope.tel, $scope.newbook, true);
					console.log($scope.tel);
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
		var sel = $filter('filter')($scope.selected_books, $scope.newbook);
		for (var i = 0; i < sel.length;i++) {
			if(sel[i][prop]) {
				arr.push(sel[i][prop].toString());
			}
		}
		console.log($scope.selected_books);
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
				removeBook($rootScope, $scope, $http, $location, book);
				var index = -1; index = $scope.mybooks.indexOf(book);
				if(index >= 0) $scope.mybooks.splice(index, 1);
			}
		});
	};
}
function accountControl($scope, $http, $location, $translate) {
	$scope.centerLat = 30;
	$scope.centerLng = -30;
	$scope.draw_map = function()
	{
		var options={
			elt:document.getElementById('map'),       /*ID of element on the page where you want the map added*/ 
			zoom:2,                                  /*initial zoom level of the map*/ 
			latLng:{lat:30, lng:-30},   /*center of map in latitude/longitude */ 
			mtype:'map',                              /*map type (osm)*/ 
			bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
			zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
		};
		$scope.map = new MQA.TileMap(options);
	};
	$scope.draw_map();
	$http.post('/api/' + $scope.user + '/users/query', {loc: {lat: '', lng: ''}})
		.success( function(data) {
			if(data.loc.lat && data.loc.lng) {
				$scope.centerLat = data.loc.lat;
				$scope.centerLng = data.loc.lng;
				$scope.map.setCenterAnimate(new MQA.LatLng($scope.centerLat, $scope.centerLng), 11,{totalMs:3000,steps:10});
			}
		});
	MQA.withModule('largezoom','viewoptions','geolocationcontrol','insetmapcontrol','mousewheel', function() {
		$scope.map.addControl(
			new MQA.LargeZoom(),
			new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
			);
		$scope.map.addControl(new MQA.ViewOptions());
		$scope.map.addControl(
			new MQA.GeolocationControl(),
			new MQA.MapCornerPlacement(MQA.MapCorner.TOP_RIGHT, new MQA.Size(10,50))
			);
		/*Inset Map Control options*/ 
		$scope.map.enableMouseWheelZoom();
	});
	function update_loc (){
		$scope.centerLat = $scope.map.getCenter().lat;
		$scope.centerLng = $scope.map.getCenter().lng;
		$scope.$apply();
	};
	MQA.EventManager.addListener($scope.map, 'move', update_loc);
	MQA.EventManager.addListener($scope.map, 'zoomend', update_loc);
	$scope.save_text = $translate('ACCOUNT.SAVE');
	$scope.save = function () {
		$scope.save_text = $translate('ACCOUNT.SAVING');
		$http.post('/api/' + $scope.user + '/users/update', {loc:{lat:$scope.centerLat, lng:$scope.centerLng}})
			.success( function(data) {
				$scope.save_text = $translate('ACCOUNT.SAVED');
			});
	};
}

function queryMyBooks ($rootScope, $scope, $http, $location) {
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
	$http.post('/api/' + $scope.user + '/users/removeBook', book)
		.success( function(data) {
		});
};

