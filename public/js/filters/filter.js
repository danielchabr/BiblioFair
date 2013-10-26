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

myApp.filter('actions', function() {
	return function(input, actions) {
		if(actions.sell || actions.donate || actions.lend) {
			var ret = [];
			for(var i = 0; i < input.length; i++) {
				if(actions.sell && input[i].actions.sell) {
					ret.push(input[i]);
				} else if(actions.donate && input[i].actions.donate) {
					ret.push(input[i]);
				} else if(actions.lend && input[i].actions.lend) {
					ret.push(input[i]);
				}
			}
			return ret;
		} else {
			return input;
		}
	}
});
