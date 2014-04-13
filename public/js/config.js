'use strict';

angular.module('bibliofair')
	//routing
	.config(['$routeProvider', '$httpProvider', '$provide',
		function($routeProvider, $httpProvider, $provide) {
			$routeProvider
				.when('/', {
					templateUrl: '/partials/welcome.html',
					controller: welcomeControl
				})
				.when('/home', {
					templateUrl: '/partials/private/home.html',
					controller: homeControl
				})
				.when('/library', {
					templateUrl: '/partials/private/library.html',
					controller: libraryControl
				})
				.when('/account', {
					templateUrl: '/partials/private/account.html',
					controller: accountControl})
				.otherwise({
					redirectTo: '/'}
				);

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
		}])
	//translator
	.config(['$translateProvider', function($translateProvider) {
			$.extend(translateEN, window.translations.en);
			$.extend(translateCS, window.translations.cs);
			$translateProvider.translations('en', translateEN);
			$translateProvider.translations('cs', translateCS);
			$translateProvider.preferredLanguage('en');
		}
	])
	//HTML5 location mode
	.config(['$locationProvider', function($locationProvider) {
			$locationProvider.html5Mode(true).hashPrefix('!');
		}
	]);
