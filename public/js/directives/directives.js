'use strict';

/*angular.module('bibliofair').directive('info', function() {
	var directiveObject = {
		restrict: 'A',
		templateUrl: '/partials/info.html',
		link: function(scope, element, attrs) {
			if(attrs.info === 'welcome')
				scope.loc = 'welcome';
		}
	};
	return directiveObject;
});*/

/**
 * Validations.
 */

angular.module('bibliofair')
	//unique username
	.directive('uniqueUsername', ['Users', function(Users) {
			return {
				require: 'ngModel',
				link: function($scope, elem, attrs, $ctrl) {
					$scope.busy = false;
					$scope.$watch(attrs.ngModel, function(username) {
						// hide old error messages
						$ctrl.$setValidity('exists', true);

						if(!username){
							return;
						}

						// show spinner
						$scope.busy = true;

						// send request to server
						Users.usernameExists(username).success(function(exists) {
							if(exists === "true"){
								$ctrl.$setValidity('exists', false);
							}
						})['finally'](function() {
							$scope.busy = false;
						});
					});
				}
			};
		}])
	//unique e-mail
	.directive('uniqueEmail', ['Users', function(Users) {
			return {
				require: 'ngModel',
				link: function($scope, elem, attrs, $ctrl) {
					$scope.busy = false;
					$scope.$watch(attrs.ngModel, function(email) {
						// hide old error messages
						$ctrl.$setValidity('exists', true);

						if(!email){
							return;
						}

						// show spinner
						$scope.busy = true;

						// send request to server
						Users.emailExists(email).success(function(exists) {
							if(exists === "true"){
								$ctrl.$setValidity('exists', false);
							}
						})['finally'](function() {
							$scope.busy = false;
						});
					});
				}
			};
		}]);
