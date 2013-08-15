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

function welcomeControl($scope, $http, $location) {
	$scope.signup = function() {
		hash = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
		$http.post('/signup', {'email': $scope.signup_email, 'password': hash.toString()}).success( function(data) {
			$scope.message = data;
		});
	}
	$scope.login = function() {
		hash = CryptoJS.SHA3($scope.login_password + $scope.login_email, {outputLength: 256 });
		$http.post('/login', {'email': $scope.login_email, 'password': hash.toString()}).success( function(data) {
			$scope.message = data;
			$location.path('/');
		}).failure( function(data) {
		});
	}

}
function homeControl($scope, $http, $location) {
}
