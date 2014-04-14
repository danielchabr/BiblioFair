angular.module('bibliofair').controller('HeaderController', ['$rootScope', '$scope', '$location', 'Users', 'Utils', 'Global', '$modal',
	function($rootScope, $scope, $location, Users, Utils, Global, $modal) {

		/**
		 * Sign the user in (locally).
		 * 
		 * @param {string} login
		 * @param {string} password
		 * @returns {undefined}
		 */

		$scope.signIn = function() {
			var user = angular.copy($scope.signin);
			Users.signIn({
				email: user.login,
				password: Utils.encrypt(user.password),
				remember: user.remember ? true : false
			}).success(function(user) {
				$rootScope.authenticated = true;
				$rootScope.user = user;
				//language
				$rootScope.lang = Global.language($rootScope.user.lang);
				//redirect
				$location.path('/home');
			}).error(function(errors) {
				if(errors[0].normalized){
					$rootScope.login_message = errors[0].message;
				}
			});
		};

		/**
		 * Sign the user out.
		 * 
		 * @returns {undefined}
		 */

		$scope.signOut = function() {
			Users.signOut().success(function() {
				$rootScope.user = null;
				$rootScope.authenticated = false;
				$location.path('/');
			});
		};

		/**
		 * Toggle the sign in form.
		 * 
		 * @returns {undefined}
		 */

		$scope.toggleSignin = function() {
			var $signin = $("#signin");
			if($signin.is(":hidden")){
				$signin.show();
				//bind to mousedown as bootstrap dropdown-toggles block the click event (they use an internal function clearMenus(); talk about good pracice, huh...)
				$(document).on("mousedown.signin", function(e) {
					var $signin = $("#signin"),
						$target = $(e.target),
						isOutOfDropdown = $target.parents("#signin").size() === 0 && $target.attr("id") !== "signin",
						isOutOfModal = $target.parents(".modal").size() === 0 && !$target.hasClass("modal") && !$target.hasClass("modal-backdrop");

					//hide only if signin is visible and not clicked in the dropdown, a modal or on the opener 
					if($signin.is(":visible") && isOutOfDropdown && isOutOfModal && $target.attr("id") !== "signinTrigger"){
						$signin.hide();
						$(document).off("mousedown.signin");
					}
				});
			}
			else{
				$signin.hide();
				$(document).off("mousedown.signin");
			}
		};

		/**
		 * Open password recovery modal.
		 */

		$scope.recoverPassword = function() {
			var modalInstance = $modal.open({
				templateUrl: '/partials/recovery.html',
				controller: ModalRecoveryCtrl,
				windowClass: 'recovery',
				resolve: {
					//
				}
			});

			modalInstance.result.then(function() {
			});
		};

	}]);
