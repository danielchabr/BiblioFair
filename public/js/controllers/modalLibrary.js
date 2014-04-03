'use strict';
var ModalLibraryCtrl = function($rootScope, $scope, $modalInstance, $translate, book, Library, Books) {
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
		$modalInstance.close('remove');
	};
	$scope.transfer = {
		send: function () {
			console.log(book);
			Library.transfer(transfer.user, book._id);
		}
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
