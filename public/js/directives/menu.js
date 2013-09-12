myApp.directive('menu', function() {
	var directiveObject = {
		restrict: 'A',
		templateUrl: '/partials/menu.html',
		link: function (scope, element, attrs) {
			if(attrs.menu == 'browse') scope.browse = 'active';
			if(attrs.menu == 'library') scope.library = 'active';
			if(attrs.menu == 'messages') scope.messages = 'active';
			if(attrs.menu == 'account') scope.account = 'active';
		}
	};
	return directiveObject;
});
