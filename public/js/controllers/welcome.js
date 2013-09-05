function welcomeControl($rootScope, $scope, $http, $location, $translate) {
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

