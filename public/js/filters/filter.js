myApp.filter('shorten', function() {
	return function(input, max) {
		if( input.length <= max ) return input;
		else return input.slice(0, max-1).concat("...");//.split(' ').pop().join(' ');
	}
});

myApp.filter('paginationShift', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});
