//angular.module('main.service' []);

//angular.module('main', ['main.service']);


function mainControl($scope, $http) {
	$scope.signup = function() {
		$http.post('/signup', {email: $scope.signup_email, password: $scope.signup_password}).success( function(data) {
			$scope.message = data;
		});
	}
	$scope.login = function() {
		$http.post('/login', {email: $scope.login_email, password: $scope.login_password}).success( function(data) {
			$scope.message = data;
		});
	}

}
