function loginControl($rootScope, $scope, $http, $location) {
	$('#div_signup_email').tooltip({placement: 'right', trigger: 'manual'});
	$('#div_signup_password').tooltip({placement: 'right', trigger: 'manual'});
	$scope.signup = function() {
		if($scope.signup_email && $scope.signup_password.length > 5) {
			hash = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
			$http.post('/signup', {'email': $scope.signup_email, 'password': hash.toString()})
				.success( function(data) {
					$scope.message = data;
				});
			console.log($scope.signup_email);
		}
		else {
			if(!$scope.signup_email) $('#div_signup_email').tooltip('show');
			else $('#div_signup_email').tooltip('hide');
			if($scope.signup_password.length < 6) $('#div_signup_password').tooltip('show');
			else $('#div_signup_password').tooltip('hide');
		}
	}
	$('#div_login_email').tooltip({placement: 'right', trigger: 'manual'});
	$('#div_login_password').tooltip({placement: 'right', trigger: 'manual'});
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
		else {
			if(!$scope.login_email) $('#div_login_email').tooltip('show');
			else $('#div_login_email').tooltip('hide');
			if($scope.login_password.length < 6) $('#div_login_password').tooltip('show');
			else $('#div_login_password').tooltip('hide');
		}
	}

}
function homeControl($rootScope, $scope, $http, $location) {
	$scope.bookOrder = 'name';
	$http.get('/api/' + $scope.user + '/books/query')
		.success( function(data) {
			$rootScope.books = [];
			for (var i = 0; i < data.length; i++) {
				var book = {};
				book.name = data[i].name;
				book.author = data[i].author;
				$rootScope.books.push(book);
			}
		});

}
function libraryControl($rootScope, $scope, $http, $location) {
	$http.get('/api/' + $scope.user + '/books/querymy')
		.success( function(data) {
			$rootScope.mybooks = [];
			for (var i = 0; i < data.length; i++) {
				var book = {};
				book.name = data[i].name;
				book.author = data[i].author;
				$rootScope.mybooks.push(book);
			}
		});
	$scope.addbook = function() {
		$http.post('/api/' + $scope.user + '/books/add', $scope.newbook)
			.success( function(data) {
				var book = {};
				book.name = $scope.newbook.name;
				book.author = $scope.newbook.author;
				$rootScope.mybooks.push(book);
				$scope.newbook.name = "";
				$scope.newbook.author = "";
			})
		.error( function(data) {
		});
	};
}
function accountControl($scope, $http, $location) {
}

