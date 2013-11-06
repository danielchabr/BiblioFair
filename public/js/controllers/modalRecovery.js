var ModalRecoveryCtrl = function ($scope, $modalInstance, $translate, APIservice) {
	$scope.remove = function () {
		$modalInstance.close('remove');
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.send_button = $translate('RECOVERY.SEND');
	$scope.recover = function (email) {
		$scope.message = undefined;
		$scope.sending = true;
		$scope.send_button = $translate('RECOVERY.SENDING');
		APIservice.users.update({action:'recover', email: email}, function(data, stat){
			console.log(stat);
			console.log(data);
			$scope.sending = false;
			if(stat == 404) {
				$scope.message = $translate('WELCOME.EMAIL_INVALID');
			}
			else {
				$scope.message = $translate('RECOVERY.SENT');
			}
			$scope.send_button = $translate('RECOVERY.SEND');
		});
	};
};
