var ModalInstanceCtrl = function ($scope, $modalInstance, book) {
	$scope.details_view = book;
	$scope.remove = function () {
		$modalInstance.close('remove');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
};
