function welcomeControl($rootScope, $scope, $http, $location, APIservice, $translate, $modal) {
	APIservice.books.read('','', 6, 0, function(data) {
		$rootScope.books = data;
		console.log(data.length);
	});
	$scope.retrieveBooks = function () {
		APIservice.books.read('', $scope.search, 6, 0, function(data) {
			var arr = $rootScope.books.concat(data);
			$rootScope.books = uniqBooks(arr, function(a, b) { if(a._id < b._id) return -1; else if (a._id > b._id) return 1; else return 0; });
		});
	}
	$scope.signup = function() {
		$scope.signup_message = "";
		if($scope.signup_email && $scope.signup_username && $scope.signup_password.length > 5) {
			hash_username = CryptoJS.SHA3($scope.signup_password + $scope.signup_username, {outputLength: 256 });
			hash_email = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
			$http.post('/signup', {'lang': $rootScope.lang, 'username': $scope.signup_username, 'email': $scope.signup_email, 'password_username': hash_username.toString(), 'password_email': hash_email.toString()})
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
		$scope.signup_message = "";
		if($scope.login_id && $scope.login_password.length > 5) {
			hash = CryptoJS.SHA3($scope.login_password + $scope.login_id, {outputLength: 256 });
			$http.post('/login', {'id': $scope.login_id, 'password': hash.toString()})
				.success( function(data) {
					if(data.message == 'loginSuccess') {
						$scope.changeLanguage(data.lang);
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

