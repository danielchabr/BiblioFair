'use strict';
var ModalBasicCtrl = function ($scope, $modalInstance, message, title) {

	$scope.message = message;
	$scope.title = title;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.approve = function() {
		$modalInstance.close(true);
	};
	$scope.disapprove = function() {
		$modalInstance.close(false);
	};
};
