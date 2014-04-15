'use strict';
var ModalBasicCtrl = function ($scope, $modalInstance, message, title, data) {

	/*
	 * Edit book modal setting
	 */
	if (data) {
		$scope.newbook = data.book;
		$scope.template = data.template;
		$scope.editing = true;
		$scope.save = function () {
			$modalInstance.close($scope.newbook);
		};
		$scope.check = function () {
			return [];
		};
		$scope.retrieveBooks = function () {
		};
	}

	/*
	 * Notification modal setting
	 */

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
