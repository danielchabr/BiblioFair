//angular.module('main.service' []);

//angular.module('main', ['main.service']);


function mainControl($scope, $http) {
	$scope.signup = function() {
		$http.post('/signup', {email: $scope.email, password: $scope.password}).success( function(data) {
			$scope.message = data;
		});
	}

}
