var http = require('http');
var books = function(db, user, operation, data, callback) {
	if(operation == 'add') {
		db.books.add(user, data, callback);
	}
	else if(operation == 'remove') {
		db.books.remove(user, data, callback);
	}
	else if(operation == 'query') {
		db.books.query(callback);
	}
	else if(operation == 'querymy') {
		db.books.querymy(user, callback);
	}
};
var users = function(db, user, operation, data, callback) {
	if(operation == 'update') {
		db.users.update(user, data, callback);
	}
	else if(operation == 'query') {
		db.users.query(user, data, callback);
	}
};
module.exports = function(db, user, service, operation, data, callback) {
	if(service == 'books') {
		books(db, user, operation, data, callback);
	}
	else if(service == 'users') {
		users(db, user, operation, data, callback);
	}
	else if(service == 'verify') {
		db.users.verify(data, callback);
	}
	else if(service == 'tel') {
		var all_data = "";
		http.get('http://data.theeuropeanlibrary.org/opensearch/json?query=' + operation + '&apikey=ev3fbloutqdhrqe3pidpal4bav', function (response) {
			response.on('data', function(data) {
				all_data += data;
			});
			response.on('end', function() {
				callback(false, all_data);
			});
		});
	}
};


