'use strict';

angular.module('bibliofair', ['ui.bootstrap', 'pascalprecht.translate', 'ngCookies']);
angular.module('bibliofair').run(['$rootScope', '$translate', '$timeout', '$modal', '$location', 'Global', 'Users',
	function($rootScope, $translate, $timeout, $modal, $location, Global, Users) {
		//user
		$rootScope.user = Global.user();
		$rootScope.authenticated = Global.authenticated();
		//books
		$rootScope.books = [];
		$rootScope.mybooks = [];
		//language
		$rootScope.lang = Global.language();
		$translate.uses($rootScope.lang);

		/**
		 * Sign the user in (locally).
		 * 
		 * @param {string} login
		 * @param {string} password
		 * @returns {undefined}
		 */

		$rootScope.signIn = function(login, password) {
			Users.signIn({
				email: login,
				password: Global.encrypt(password)
			}).success(function(user) {
				$rootScope.authenticated = true;
				$rootScope.user = user;
				//language
				$rootScope.lang = Global.language($rootScope.user.lang);
				//redirect
				$location.path('/home');
			}).error(function(error) {
				if(error.normalized === true){
					$rootScope.login_message = error.errors[0].message;
				}
			});
		};

		/**
		 * Sign the user out.
		 * 
		 * @returns {undefined}
		 */

		$rootScope.signOut = function() {
			Users.signOut().success(function() {
				$rootScope.user = null;
				$rootScope.authenticated = false;
				$location.path('/');
			});
		};

		/**
		 * Return "active" if given path is currently active (used for links classes in menu).
		 * 
		 * @param {string} path
		 * @returns {String}
		 */

		$rootScope.isActive = function(path) {
			return $location.path().substr(0, path.length) === path ? "active" : "";
		};

		/**
		 * Change language.
		 * 
		 * @param {string} lang
		 * @returns {undefined}
		 */

		$rootScope.changeLanguage = function(lang) {
			$rootScope.lang = Global.language(lang);
			if($rootScope.authenticated){
				Users.updateLanguage($rootScope.lang);
			}
		};

		/**
		 * Open notification window.
		 * 
		 * @param {type} message
		 * @returns {undefined}
		 */

		$rootScope.notify = function(message) {
			var modalInstance = $modal.open({
				templateUrl: '/partials/notification.html',
				controller: ModalNotificationCtrl,
				resolve: {
					message: function() {
						return message;
					}
				}
			});
			modalInstance.result.then(function() {
			}, function() {
			});
		};

		/**
		 * Send GA code every 10 seconds.
		 * 
		 * @param {time elapsed} elapsed
		 * @returns {undefined}
		 */

		var GANotifier = function(elapsed) {
			$timeout(function() {
				elapsed += 10;
				ga('send', 'event', 'time_elapsed', 'time_spent', 'Time elapsed', elapsed);
				GANotifier(elapsed);
			}, 10000);
		};
		GANotifier(0);

		/** TODO sort out */

		$rootScope.collapse = function() {
			$rootScope.isCollapsed = $('.navbar-toggle').css("display") === 'none';
		};
		window.onresize = function() {
			$rootScope.collapse();
			$rootScope.$apply();
		};

	}]);