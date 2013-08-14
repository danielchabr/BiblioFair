angular.module('mainapp', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('', {templateUrl: '/partials/welcome.html',   controller: welcomeControl}).
      otherwise({redirectTo: ''});
}]);
