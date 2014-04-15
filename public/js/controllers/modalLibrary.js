'use strict';
var ModalLibraryCtrl = function($rootScope, $scope, $modalInstance, book, Library, $translate) {
	$scope.details_view = book;
	if(book.published){
		$scope.details_view.published = new Date(book.published).getFullYear();
	}
	$scope.updateActions = function() {
		Library.update($scope.details_view._id, {
			actions: $scope.details_view.actions
		}).success(function(data) {
			console.log(data);
		});
	};
	$scope.save = function() {
		Library.update($scope.details_view._id, {
			note: $scope.details_view.note
		}).success(function(data) {
			console.log(data);
		});
	};
	$scope.remove = function() {
		$rootScope.approve(undefined, $translate.instant('LIBRARY.APPROVE_REMOVE'), function () {
			$modalInstance.close('remove');		
		});
	};
	$scope.edit = function() {
		$modalInstance.close('edit');		
	};
	$scope.transfer = {
		send: function () {
			var transfer = angular.copy($scope.transfer);
			Library.transfer(book._id, transfer.user, transfer.type).success(function(data){
				$scope.details_view.lent = data.lent;
				if(transfer.type === "permanent"){
					window.alerts.push({msg:$translate.instant('LIBRARY.TRANSFER.SUCCESS_PERMANENT') + transfer.user + ".", type: 'info'});
					$scope.remove();
				}
				else if(transfer.type === 'temporary'){
					window.alerts.push({msg:$translate.instant('LIBRARY.TRANSFER.SUCCESS_TEMPORARY') + transfer.user + ".", type: 'info'});
					$scope.cancel();
				}
				
			}).error(function(errors){
				if(errors[0].normalized){
					$scope.transfer.error = errors[0].message;
				}
				else{
					console.log(errors);
				}
			});
		},
		returned: function(to){
			Library.returned(book._id, to).success(function(data){
				$scope.details_view.lent = data.lent;
				window.alerts.push({msg:$translate.instant('LIBRARY.TRANSFER.SUCCESS_RETURNED'), type: 'info'});
				$scope.cancel();
			}).error(function(errors){
				console.log(errors);
			})
		}
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
