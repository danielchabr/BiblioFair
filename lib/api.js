var books = function(db, user, operation, data, callback) {
	if(operation == 'add') {
		db.books.add(user, data, callback);
	}
	else if(operation == 'query') {
		db.books.query(callback);
	}
	else if(operation == 'querymy') {
		db.books.querymy(user, callback);
	}
};
module.exports = function(db, user, service, operation, data, callback) {
	if(service == 'books') {
		books(db, user, operation, data, callback);
	}
};
