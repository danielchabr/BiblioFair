'use strict';
var ModalRecoveryCtrl = function($scope, $modalInstance, $translate, Users) {
	$scope.remove = function() {
		$modalInstance.close('remove');
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.send_button = $translate.instant('RECOVERY.SEND');

	/**
	* Send the recovery email.
	* 
	* @param {string} email
	* @returns {undefined}
	*/

	$scope.recover = function(email) {
		$scope.message = undefined;
		$scope.sending = true;
		$scope.send_button = $translate.instant('RECOVERY.SENDING');
		var always = function () {
			$scope.sending = false;
			$scope.send_button = $translate.instant('RECOVERY.SEND');
		}
		Users.recover(email).success(function(data) {
			$scope.message = $translate.instant('RECOVERY.SENT');
			always();
		}).error(function(error) {
			$scope.message = $translate.instant('errors.email.invalid');
			always();
		});
	};
};
