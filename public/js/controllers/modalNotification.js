'use strict';
var ModalNotificationCtrl = function ($scope, $modalInstance, message) {

	$scope.message = message;

	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
