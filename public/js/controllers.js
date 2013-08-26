function loginControl($rootScope, $scope, $http, $location) {
	$scope.signup = function() {
		if($scope.signup_email && $scope.signup_password.length > 5) {
			hash = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
			$http.post('/signup', {'email': $scope.signup_email, 'password': hash.toString()})
				.success( function(data) {
					$scope.message = data;
				});
		}
	}
	$scope.login = function() {
		if($scope.login_email && $scope.login_password.length > 5) {
			hash = CryptoJS.SHA3($scope.login_password + $scope.login_email, {outputLength: 256 });
			$http.post('/login', {'email': $scope.login_email, 'password': hash.toString()})
				.success( function(data) {
					if(data == 'loginSuccess') {
						$scope.message = data;
						$rootScope.user = $scope.login_email;
						$location.path('/');
					}
					else {
						$scope.message = "Pleasy try again";
					}
				})
			.error( function(data) {
				$scope.message = "Pleasy try again";
			});
		}
	}
}
function homeControl($rootScope, $scope, $http, $location) {
	$scope.bookOrder = 'title';
	$scope.details = function (book) {
		$rootScope.details_view = book;
	};
	queryBooks($rootScope, $scope, $http, $location);

}
function libraryControl($rootScope, $scope, $http, $location, $filter) {
	queryMyBooks($rootScope, $scope, $http, $location);
	queryBooks($rootScope, $scope, $http, $location);

	$scope.addbook = function() {
		if($scope.newbook.title && $scope.newbook.author) {
		$http.post('/api/' + $scope.user + '/books/add', $scope.newbook)
			.success( function(data) {
				var book = {};
				book.title = $scope.newbook.title;
				book.author = $scope.newbook.author;
				$rootScope.mybooks.push(book);
				$rootScope.books.push(book);
				$scope.newbook.title = "";
				$scope.newbook.author = "";
			})
		.error( function(data) {
		});
		}
	};
	$scope.details = function (book) {
		$rootScope.details_view = book;
	};
	$scope.selectBook = function () {
		$scope.selected_books = $filter('filter')($scope.books, $scope.newbook, true);
		if($scope.selected_books.length == 1) {
			$scope.newbook.title = $scope.selected_books[0].title;
			$scope.newbook.author = $scope.selected_books[0].author;
		}
	};
}
function accountControl($scope, $http, $location) {
	$scope.centerLat = 30;
	$scope.centerLng = -30;
	$http.post('/api/' + $scope.user + '/users/query', {loc: {lat: '', lng: ''}})
		.success( function(data) {
			if(data.loc) {
				$scope.centerLat = data.loc.lat;
				$scope.centerLng = data.loc.lng;
			}
		});
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
	$scope.save_text = "Save";
	$scope.save = function () {
		$scope.save_text = "Saving ...";
		$http.post('/api/' + $scope.user + '/users/update', {loc:{lat:$scope.centerLat, lng:$scope.centerLng}})
			.success( function(data) {
				$scope.save_text = "Saved";
			});
	};
}

function queryMyBooks ($rootScope, $scope, $http, $location) {
	$http.get('/api/' + $scope.user + '/books/querymy')
		.success( function(data) {
			$rootScope.mybooks = [];
			for (var i = 0; i < data.length; i++) {
				var book = {};
				book.title = data[i].title;
				book.author = data[i].author;
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
				book.title = data[i].title;
				book.author = data[i].author;
				$rootScope.books.push(book);
			}
		});
};
