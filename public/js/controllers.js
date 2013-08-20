//angular.module('main.service' []);

//angular.module('main', ['main.service']);
/*
		<script>
			var hash = CryptoJS.SHA3("Message", { outputLength: 512 });
			var hash = CryptoJS.SHA3("Message", { outputLength: 384 });
			var hash = CryptoJS.SHA3("Message", { outputLength: 256 });
			var hash = CryptoJS.SHA3("Message", { outputLength: 224 });
		</script>
		*/

function loginControl($rootScope, $scope, $http, $location) {
	$scope.signup = function() {
		hash = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
		$http.post('/signup', {'email': $scope.signup_email, 'password': hash.toString()})
		.success( function(data) {
			$scope.message = data;
		});
	}
	$scope.login = function() {
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
			//$location.path('/login');
		});
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

