angular.module('mainapp', []).

config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', function($routeProvider, $locationProvider, $httpProvider, $provide) {
	$routeProvider
	.when('/', {templateUrl: '/partials/home.html',   controller: homeControl})
	.when('/login', {templateUrl: '/partials/welcome.html',   controller: loginControl})
	.when('/library', {templateUrl: '/partials/library.html',   controller: libraryControl})
	.when('/account', {templateUrl: '/partials/account.html',   controller: accountControl})
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
					$location.path('/login');
				}
				return $q.reject(rejection);
			}
		};
	});
	$httpProvider.interceptors.push('myHttpInterceptor');
}])
.run(function ($rootScope, $http, $location) {
	$rootScope.user = {};
	$rootScope.books = [];
	$rootScope.mybooks = [];

	$http.get('/user')
	.success(function (data) {
		$rootScope.user = data;
	})
	.error(function (data) {
		$location.path('/login');
	});

	$rootScope.logout = function () {
		$rootScope.user = {}
		$http.post('/logout', {});
		//clearListCookies();
		$location.path('/login');
	}
});
