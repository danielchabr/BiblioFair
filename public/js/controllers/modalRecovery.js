'use strict';
var ModalRecoveryCtrl = function($scope, $modalInstance, $translate, Users) {
    $scope.remove = function() {
        $modalInstance.close('remove');
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.send_button = $translate('RECOVERY.SEND');
	
	/**
	 * Send the recovery email.
	 * 
	 * @param {string} email
	 * @returns {undefined}
	 */
	
    $scope.recover = function(email) {
        $scope.message = undefined;
        $scope.sending = true;
        $scope.send_button = $translate('RECOVERY.SENDING');
        Users.recover(email).success(function(data) {
            $scope.message = $translate('RECOVERY.SENT');
        }).error(function(error) {
            $scope.message = $translate('errors.email.invalid');
        }).always(function(){
            $scope.sending = false;
            $scope.send_button = $translate('RECOVERY.SEND');
        });
    };
};
