myApp.directive('menu', function() {
	var directiveObject = {
		restrict: 'A',
		templateUrl: '/partials/menu.html',
		replace: false,
		link: function (scope, element, attrs) {
			if(attrs.menu == 'browse') scope.browse = 'active';
			if(attrs.menu == 'library') scope.library = 'active';
			if(attrs.menu == 'account') scope.account = 'active';
		}
	};
	return directiveObject;
});
myApp.directive('info', function() {
	var directiveObject = {
		restrict: 'A',
		templateUrl: '/partials/info.html',
		link: function (scope, element, attrs) {
			if(attrs.info == 'welcome') scope.loc = 'welcome';
		}
	};
	return directiveObject;
});
/*
myApp.directive('request', function($compile) {
	var directiveObject = {
		restrict: 'A',
		template: '<button class="btn btn-warning">ahoj</button>',
		compile: function(element, attrs) {
			var e = '<button class="btn btn-warning">ahoj</button>';
            //$compile(e.contents())(scope);
			var newelem = $(e);
            element.replaceWith(newelem);
		}
	};
	return directiveObject;
});*/
