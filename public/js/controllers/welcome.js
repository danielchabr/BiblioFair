'use strict';
function welcomeControl($rootScope, $scope, $http, $location, $position, APIservice, Books, $translate, $modal) {

	//// Animate scrollUp
	$('a[class=go_to_bottom]').click(function(){
		$('html, body').animate({scrollTop:$(document).height()}, 'slow');
	});

	//// Scroll down arrow
	$('#arrow').mouseover(function() {
		$('html, body').animate({scrollTop:$('#arrow').offset().top - 50}, 'slow');
	});
	$('#arrow').click(function() {
		$('html, body').animate({scrollTop:$('#arrow').offset().top - 50}, 'slow');
	});
	var windowEl = angular.element(document);
	var button_shown = false;
	windowEl.on('scroll', function() {
		$scope.$apply(function() {
			//// checks if scrolled to bottom and hides arrow if yes
			if($('.info').offset().top + 32 < $(window).scrollTop() + $(window).height() ) {
				$scope.isAtBottom = true;
			} else {
				$scope.isAtBottom = false;
			}

			//// is register button visible?
			if(!button_shown && isScrolledIntoView($("#signup_button"))) {
				ga('send', 'event', 'scrolling', 'scrolled_to_register_button');
				button_shown = true;
			}
		});
	});

	function isScrolledIntoView(elem)
	{
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}

	// login dropdown    
	$("#login_opener").on("click", function(e) {
		var $login = $("#login");
		if ($login.is(":hidden")) {
			$login.show();
			//bind to mousedown as bootstrap dropdown-toggles block the click event (they use an internal function clearMenus(); talk about good pracice, huh...)
			$(document).on("mousedown.login", function(e) {
				var $login = $("#login"),
					$target = $(e.target),
					outofDropdown = $target.parents("#login").size() === 0 && $target.attr("id") !== "login",
					outofModal = $target.parents(".modal").size() === 0 && !$target.hasClass("modal") && !$target.hasClass("modal-backdrop");

				//hide only if login is visible and not clicked in the dropdown, a modal or on the opener 
				if ($login.is(":visible") && outofDropdown && outofModal && $target.attr("id") !== "login_opener") {
					$login.hide();
					$(document).off("mousedown.login");
				}
			});
		}
		else {
			$login.hide();
			$(document).off("mousedown.login");
		}
	});
	/////////////////////
	$scope.bookOrder = 'title';
    
    //book count
    Books.count().success(function(data){
        $scope.books_available = data;
    });
    
    //initial books to show
    Books.get({limit: 6}).success(function(data){
        $rootScope.books = data;
    });
    
    //retrieve books
	$scope.retrieveBooks = function () {
        Books.get({query: $scope.search_query,limit: 6}).success(function(data){
            var arr = $rootScope.books.concat(data);
			$rootScope.books = uniqBooks(arr, function(a, b) { if(a._id < b._id) return -1; else if (a._id > b._id) return 1; else return 0; });
        });
	};
    
	//// Sign up action
	$scope.signup = function() {
		$scope.signup_message = "";
		if($scope.signup_email && $scope.signup_username && $scope.signup_password.length > 5) {
			var hash_username = CryptoJS.SHA3($scope.signup_password + $scope.signup_username, {outputLength: 256 });
			var hash_email = CryptoJS.SHA3($scope.signup_password + $scope.signup_email, {outputLength: 256 });
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
			var hash = CryptoJS.SHA3($scope.login_password + $scope.login_id, {outputLength: 256 });
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
	ga('send', 'pageview', '/');
}

