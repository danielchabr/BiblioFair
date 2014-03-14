'use strict';

//Set up routes
angular.module('bibliofair').config(['$routeProvider', '$httpProvider', '$provide', '$translateProvider',
	function($routeProvider, $httpProvider, $provide, $translateProvider) {
		//routes
		$routeProvider
				.when('/', {templateUrl: '/partials/welcome.html', controller: welcomeControl})
				.when('/en', {templateUrl: '/partials/welcome.html', controller: welcomeControl})
				.when('/cz', {templateUrl: '/partials/welcome.html', controller: welcomeControl})
				.when('/home', {templateUrl: '/partials/private/home.html', controller: homeControl})
				.when('/library', {templateUrl: '/partials/private/library.html', controller: libraryControl})
				.when('/account', {templateUrl: '/partials/private/account.html', controller: accountControl})
				.otherwise({redirectTo: '/'});

		//interceptor
		$provide.factory('myHttpInterceptor', function($q, $location, $rootScope) {
			return {
				'response': function(response) {
					return response || $q.when(response);
				},
				'responseError': function(rejection) {
					var status = rejection.status;
					if(status === 401){
						$rootScope.redirect = $location.url(); // save the current url so we can redirect the user back
						if($location.path() === '/en' || $location.path() === '/cz'){
						}
						else{
							$location.path('/');
							$location.replace();
						}
					}
					return $q.reject(rejection);
				}
			};
		});
		$httpProvider.interceptors.push('myHttpInterceptor');

		//translator
		$translateProvider.translations('en', translateEN);
		$translateProvider.translations('cz', translateCZ);
		$translateProvider.preferredLanguage('en');
	}]);

//Setting HTML5 Location Mode
angular.module('bibliofair').config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true).hashPrefix('!');
	}
]);
