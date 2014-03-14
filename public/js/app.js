'use strict';

/**
 * Angular module dependencies.
 */

angular.module('bibliofair', ['ui.bootstrap', 'pascalprecht.translate']);

/**
 * Run.
 */

angular.module('bibliofair').run(function($rootScope, $timeout, $modal, $location, $translate, Global, Users) {
	//user
	$rootScope.user = Global.user();
	$rootScope.authenticated = Global.authenticated();
	//books
	$rootScope.books = [];
	$rootScope.mybooks = [];

	$rootScope.signOut = function() {
		Users.signOut().success(function() {
			$rootScope.user = null;
			$rootScope.authenticated = false;
			$location.path('/');
		});
	};
	$rootScope.collapse = function() {
		$rootScope.isCollapsed = $('.navbar-toggle').css("display") === 'none';
	};
	window.onresize = function() {
		$rootScope.collapse();
		$rootScope.$apply();
	};
	$rootScope.changeLanguage = function(langKey) {
		if(langKey === 'en' || langKey === 'cz'){
			$translate.uses(langKey);
			$rootScope.lang = langKey;
			if($rootScope.authenticated){
				Users.updateLanguage(langKey).success(function(data) {
					if(langKey === 'en' && ($location.path().slice(1, 3) === 'cz' || $location.absUrl().slice(-3, -1) === 'cz'))
						window.location = '../';
					else if(langKey === 'cz' && ($location.path().slice(1, 3) === 'en' || $location.absUrl().slice(-3, -1) === 'en'))
						window.location = '../';
				});
			}
		}
	};

	//// Notification modal window can be called from any controller
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

	//Is menu active?
	$rootScope.isActive = function(path) {
		return $location.path().substr(0, path.length) === path ? "active" : "";
	};

	//// Send GA code each 10 secs
	var GANotifier = function(elapsed) {
		$timeout(function() {
			elapsed += 10;
			ga('send', 'event', 'time_elapsed', 'time_spent', 'Time elapsed', elapsed);
			GANotifier(elapsed);
		}, 10000);
	};
	GANotifier(0);


	if($rootScope.authenticated){
		if($location.path() !== '/library' && $location.path() !== '/account' && $location.path() !== '/home'){
			$location.path('/home');
		}
		$rootScope.changeLanguage($rootScope.user.language);
	}
	else{
		if($location.path().slice(1, 3) === 'en' || $location.absUrl().slice(-3, -1) === 'en'){
			$rootScope.changeLanguage('en');
		} else if($location.path().slice(1, 3) === 'cz' || $location.absUrl().slice(-3, -1) === 'cz'){
			$rootScope.changeLanguage('cz');
		}

		/*TODO
		 * else if(data.lang){
		 $rootScope.changeLanguage(data.lang);
		 }*/

		if($location.path() !== '/en' && $location.path() !== '/cz'){
			//TODO remove
			$rootScope.lang = 'cz';
			$location.path('/');
			$location.replace();
		}
	}
});


