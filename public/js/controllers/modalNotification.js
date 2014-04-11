'use strict';
var ModalNotificationCtrl = function ($scope, $modalInstance, message, title) {

	$scope.message = message;
	$scope.title = title;

	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
