'use strict';
var ModalLibraryCtrl = function($rootScope, $scope, $modalInstance, book, Library, Users, $translate) {
	$scope.details_view = book;
	//if(book.published){
	//	$scope.details_view.published = new Date(book.published).getFullYear();
	//}
	$scope.updateActions = function() {
		Library.update($scope.details_view._id, {
			actions: $scope.details_view.actions
		}).success(function(data) {
			console.log(data);
		});
	};
	
	$scope.getUsernames = function(value){
		return Users.getUsernames(value).then(function(res){
			var usernames = [];
			res.data.forEach(function(user){
				if(user.username !== $rootScope.user.username){
					usernames.push(user.username);
				}
			});
			return usernames;
		});
	}
	
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
	$scope.removeInstant = function() {
		$modalInstance.close('remove');		
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
					$rootScope.notify($translate.instant('LIBRARY.TRANSFER.SUCCESS_PERMANENT') + transfer.user + ".");
					$scope.removeInstant();
				}
				else if(transfer.type === 'temporary'){
					$rootScope.notify($translate.instant('LIBRARY.TRANSFER.SUCCESS_TEMPORARY') + transfer.user + ".");
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
				$rootScope.notify($translate.instant('LIBRARY.TRANSFER.SUCCESS_RETURNED'));
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
