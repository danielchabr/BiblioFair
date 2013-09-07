var http = require('http');
module.exports = function(db, req, res, auth) {
	var path = req.path.split('/');
	if(path[0] == "") path.shift();
	path.shift();
	path.shift();

	if(path[0] == 'books') {
		books(db, req, res, path.shift());
	}
	else if(path[1] == 'users') {
		users(db, req, res, path.shift());
	}
	else if(path[1] == 'tel') {
		tel(req, res, path.shift());
	}
	else {
		res.status(400).send();
	}
};

var books = function(db, req, res, callback) {
	if(req.method == 'GET') { // READ
		//db.books.query();
	}
	else if(req.method == 'POST') { // CREATE
		db.books.remove(user, data, callback);
	}
	else if(req.method == 'PUT') { // UPDATE
		db.books.query(callback);
	}
	else if(req.method == 'DELETE') {  // DELETE
		db.books.querymy(user, callback);
	}
};
var users = function(db, user, operation, data, callback) {
	if(req.method == 'GET') { // READ
		db.users.add(user, data, callback);
	}
	else if(req.method == 'POST') { // CREATE
		db.users.remove(user, data, callback);
	}
	else if(req.method == 'PUT') { // UPDATE
		db.users.query(callback);
	}
	else if(req.method == 'DELETE') {  // DELETE
		db.users.querymy(user, callback);
	}
};
var tel = function (req, res, path) {
	if(req.query.q) {
		var options = require('url').parse('http://data.theeuropeanlibrary.org/opensearch/json?query=' + req.query.q + '&apikey=ev3fbloutqdhrqe3pidpal4bav');
		options.rejectUnauthorized = false;
		var all_data = "";
		http.get(options, function (response) {
			response.on('data', function(data) {
				all_data += data;
			});
			response.on('end', function() {
				res.send(all_data);
			});
			response.on('error', function(e) {
				console.log(e);
			});
		});
	}
}
