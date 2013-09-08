// API
var http = require('http');
module.exports = function(err, db, req, res) {
	var auth = !err;
	var path = req.path.split('/');
	if(path[0] == "") path.shift();
	path.shift();
	path.shift();

	if(path[0] == 'books') {
		books(db, req, res, path.shift(), path);
	}
	else if(path[0] == 'users') {
		users(db, req, res, path.shift(), path);
	}
	else if(path[0] == 'tel') {
		tel(req, res, path.shift());
	}
	else {
		res.status(400).send();
	}
};

var books = function(db, req, res, path, auth) {
	if(req.method == 'GET') { // READ
		db.books.read(req.query.fields, req.query.q, req.query.limit, req.query.offset, function(err, data) {
			if(!err) {
				res.send(data);
			} 
			else {
				res.status(404).send();
			}
		});
	}
	if(auth) {
		if(req.method == 'POST') { // CREATE
			db.books.remove(user, data, callback);
		}
		else if(req.method == 'PUT') { // UPDATE
			db.books.query(callback);
		}
		else if(req.method == 'DELETE') {  // DELETE
			db.books.querymy(user, callback);
		}
	}
};
var users = function(db, req, res, path, auth) {
	if(auth) {
		if(req.method == 'GET') { // READ
			db.users.get(req.query.id, function (err, data) {
				if(!err) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'POST') { // CREATE
			db.users.create(user, data, callback);
		}
		else if(req.method == 'PUT') { // UPDATE
			db.users.update(req.body.id, req.body, function(err, data){
				if(!err) {
					res.send('OK');
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'DELETE') {  // DELETE
			db.users.del(user, callback);
		}
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
