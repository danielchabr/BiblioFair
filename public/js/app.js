angular.module('mainapp', []).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {templateUrl: '/partials/home.html',   controller: homeControl})
		.when('/login', {templateUrl: '/partials/welcome.html',   controller: welcomeControl})
		.otherwise({redirectTo: '/partials/404.html'});
	$locationProvider.html5Mode(false);
}]);
