
function MainControl($scope, $http) {
	$scope.login = function() {
		$http.post('/login', {email: $scope.email, password: $scope.password}).success( function(data) {
			$scope.email = data;
		});
	}

}
