function welcomeControl($rootScope, $scope, $http, $location, $translate, $modal) {
	$scope.signup = function() {
		if($scope.signup_email && $scope.signup_username && $scope.signup_password.length > 5) {
			hash_username = CryptoJS.SHA3($scope.signup_password + $scope.signup_username, {outputLength: 256 });
			hash_email = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
			$http.post('/signup', {'lang': $scope.lang, 'username': $scope.signup_username, 'email': $scope.signup_email, 'password_username': hash_username.toString(), 'password_email': hash_email.toString()})
				.success( function(data) {
					if(data == 'registered') {
						$scope.signup_message = $translate('WELCOME.VERIFICATION_SENT') + $scope.signup_email;
					}
					else if(data == 'emailExists') {
						$scope.signup_message = $translate('WELCOME.EMAIL_EXISTS');
					}
					else if(data == 'usernameExists') {
						$scope.signup_message = $translate('WELCOME.USERNAME_EXISTS');
					}
				});
		} else {
			if($scope.signup_password.length < 6) {
				$scope.signup_message = $translate('WELCOME.SHORT_PASSWORD');
			}
		}
	}
	$scope.login = function() {
		if($scope.login_id && $scope.login_password.length > 5) {
			hash = CryptoJS.SHA3($scope.login_password + $scope.login_id, {outputLength: 256 });
			$http.post('/login', {'id': $scope.login_id, 'password': hash.toString()})
				.success( function(data) {
					if(data == 'loginSuccess') {
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
	$scope.open = function () {
		var modalInstance = $modal.open({
			templateUrl: '/partials/recovery.html',
			controller: ModalRecoveryCtrl,
			resolve: {
			}
		});

		modalInstance.result.then(function () {
		});
	};
}

