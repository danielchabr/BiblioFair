var books = function(db, user, operation, data, callback) {
	if(operation == 'add') {
		db.books.add(data, callback);
	}
	else if(operation == 'query') {
		db.books.query(callback);
	}
};
module.exports = function(db, user, service, operation, data, callback) {
	if(service == 'books') {
		books(db, user, operation, data, callback);
	}
};
