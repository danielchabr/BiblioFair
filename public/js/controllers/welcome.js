function welcomeControl($rootScope, $scope, $http, $location, $position, APIservice, $translate, $modal) {
	//// Animate scrollUp
	$('a[class=bottom]').click(function(){
		$('html, body').animate({scrollTop:$(document).height()}, 'slow');
	});
	//// Log in dropdown hack
	var switcher = function() {
		var x = {};
		x.value = false;
		x.change = function(){ x.value = !x.value;};
		return x;
	};
	var switchoff = switcher();
	$('body').click(function() {
		if(!switchoff.value) {
			$('#login').css('display', 'none');
		}
		if(switchoff.value == true) {
			switchoff.change();
			$('#login_all').addClass('open');
		} else {
			$('#login_all').removeClass('open');
		}
	});
	$('#login_opener').click(function() {
		if($('#login').css('display') == 'none') {
			$('#login').css('display', 'block');
			$('#login_all').addClass('open');
			switchoff.value = false;
		} else {
			$('#login').css('display', 'none');
		}
	});
	$('#login').click(function() {
		switchoff.change();
		switchoff.value = true;
		$('#login_all').addClass('open');
	});
	/////////////////////
	$scope.bookOrder = 'title';
	APIservice.books.count(function(data) {
		if(data) $scope.books_available = data;
	});
	APIservice.books.read('','', 6, 0, function(data) {
		$rootScope.books = data;
	});
	$scope.retrieveBooks = function () {
		APIservice.books.read('', $scope.search_query, 6, 0, function(data) {
			var arr = $rootScope.books.concat(data);
			$rootScope.books = uniqBooks(arr, function(a, b) { if(a._id < b._id) return -1; else if (a._id > b._id) return 1; else return 0; });
		});
	}
	//// Sign up action
	$scope.signup = function() {
		$scope.signup_message = "";
		if($scope.signup_email && $scope.signup_username && $scope.signup_password.length > 5) {
			hash_username = CryptoJS.SHA3($scope.signup_password + $scope.signup_username, {outputLength: 256 });
			hash_email = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
			$http.post('/signup', {'lang': $rootScope.lang, 'username': $scope.signup_username, 'email': $scope.signup_email, 'password_username': hash_username.toString(), 'password_email': hash_email.toString()})
				.success( function(data) {
					if(data == 'registered') {
						$scope.signup_message = $translate('WELCOME.VERIFICATION_SENT') + $scope.signup_email;
						//// Google Analytics register goal
						ga('send', 'event', 'Register', 'register');
					}
					else if(data == 'emailExists') {
						$scope.signup_message = $translate('WELCOME.EMAIL_EXISTS');
					}
					else if(data == 'usernameExists') {
						$scope.signup_message = $translate('WELCOME.USERNAME_EXISTS');
					}
					else if(data == 'invalidEmail') {
						$scope.signup_message = $translate('WELCOME.EMAIL_INVALID');
					}
					else if(data == 'invalidUsername') {
						$scope.signup_message = $translate('WELCOME.USERNAME_INVALID');
					}
				});
		} else {
			if($scope.signup_password.length < 6) {
				$scope.signup_message = $translate('WELCOME.SHORT_PASSWORD');
			}
		}
	}
	//// Log in action
	$scope.login = function() {
		$scope.signup_message = "";
		if($scope.login_id && $scope.login_password.length > 5) {
			hash = CryptoJS.SHA3($scope.login_password + $scope.login_id, {outputLength: 256 });
			$http.post('/login', {'id': $scope.login_id, 'password': hash.toString()})
				.success( function(data) {
					if(data.message == 'loginSuccess') {
						$rootScope.user.username = data.user.username;
						$rootScope.user.email = data.user.email;
						$rootScope.user.library = data.user.library;
						$rootScope.user.loc = data.user.loc;
						$scope.changeLanguage(data.lang);
						$location.path('/home');
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
	//// Password recovery modal window
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
	//// Google analytics
	ga('send', 'pageview', '/login');
}

