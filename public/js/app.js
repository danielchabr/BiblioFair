var myApp = angular.module('myApp', ['ui.bootstrap', 'pascalprecht.translate']);

myApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', '$translateProvider', function($routeProvider, $locationProvider, $httpProvider, $provide, $translateProvider) {
	$routeProvider
	.when('/', {templateUrl: '/partials/welcome.html',   controller: welcomeControl})
	.when('/home', {templateUrl: '/partials/private/home.html',   controller: homeControl})
	.when('/library', {templateUrl: '/partials/private/library.html',   controller: libraryControl})
	.when('/account', {templateUrl: '/partials/private/account.html',   controller: accountControl})
	.otherwise({redirectTo: '/'});
	$locationProvider.html5Mode(true).hashPrefix('!');
	$provide.factory('myHttpInterceptor', function($q, $location, $rootScope) {
		return {
			'response': function(response) {
				return response || $q.when(response);
			},
			'responseError': function(rejection) {
				var status = rejection.status;
				if (status == 401) {
					$rootScope.redirect = $location.url(); // save the current url so we can redirect the user back
					$location.path('/');
					$location.replace();
				}
				return $q.reject(rejection);
			}
		};
	});
	$httpProvider.interceptors.push('myHttpInterceptor');
	$translateProvider.translations('en', translateEN);
	$translateProvider.translations('cz', translateCZ);
	$translateProvider.preferredLanguage('en');
}]);
myApp.run(function ($rootScope, $http, $location, $translate, APIservice) {
	$rootScope.books = [];
	$rootScope.mybooks = [];
	$rootScope.user = {};

	$http.get('/user')
	.success(function (data) {
		$location.path('/home');
		$location.replace();
		$rootScope.user = data;
		if(data.lang) $rootScope.changeLanguage(data.lang);
		APIservice.users.read(function(data) {
			$rootScope.user.username = data.username;
			$rootScope.user.email = data.email;
			$rootScope.user.library = data.library;
			$rootScope.user.loc = data.loc;
		});
	})
	.error(function (data) {
		if(data.lang) $rootScope.changeLanguage(data.lang);
		$location.path('/');
	});

	$rootScope.logout = function () {
		$rootScope.user = {};
		APIservice.users.del(function(data) {
			$location.path('/');
		});
	};
	$rootScope.collapse = function () {
		$rootScope.isCollapsed = $('.navbar-toggle').css("display") == 'none';
	};
	window.onresize = function () {$rootScope.collapse();$rootScope.$apply();};
	$rootScope.changeLanguage = function (langKey) {
		if(langKey == 'en' || langKey == 'cz') {
			$translate.uses(langKey);
			$rootScope.lang = langKey;
			APIservice.users.update({action: 'lang', lang: langKey}, function(err) {
			});
		}
	};
});
