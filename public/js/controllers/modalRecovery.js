var ModalRecoveryCtrl = function ($scope, $modalInstance, APIservice) {
	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	$scope.recover = function (email) {
		APIservice.users.update({action:'recover', email: email}, function(data){
			$modalInstance.dismiss('cancel');
		});
	};
};
