'use strict';
var ModalNotificationCtrl = function ($scope, $modalInstance, $translate, message) {

	$scope.message = message;

	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
