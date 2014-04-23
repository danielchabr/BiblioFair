'use strict';
var ModalBookCtrl = function($rootScope, $scope, $modalInstance, $translate, book, Library, Books) {
	$scope.details_view = book;
	//if(book.published){
	//	$scope.details_view.published = new Date(book.published).getFullYear();
	//}
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};
