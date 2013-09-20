// API
var http = require('http');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5');

module.exports = function(err, db, req, res) {
	var auth = !err;
	var path = req.path.split('/');
	if(path[0] == "") path.shift();
	path.shift();
	path.shift();

	if(path[0] == 'books') {
		books(db, req, res, path, auth);
	}
	else if(path[0] == 'library') {
		library(db, req, res, path, auth);
	}
	else if(path[0] == 'users') {
		users(db, req, res, path, auth);
	}
	else if(path[0] == 'messages') {
		messages(db, req, res, path, auth);
	}
	else if(path[0] == 'tel') {
		tel(req, res, path, auth);
	}
	else {
		res.status(400).send();
	}
};

var books = function(db, req, res, path, auth) {
	console.log('books API');
	path.shift();
	if(req.method == 'GET') { // READ
		if(path[0]) {
			db.books.readById(path[0], function(err, data) {
				if(!err) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else {
			db.books.read(req.query.fields, req.query.q, req.query.limit, req.query.offset, function(err, data) {
				if(!err) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
	}
	if(auth) {
		if(req.method == 'POST') { // CREATE
			//db.books.remove(user, data, callback);
		}
		else if(req.method == 'PUT') { // UPDATE
			//db.books.query(callback);
		}
		else if(req.method == 'DELETE') {  // DELETE
			//db.books.querymy(user, callback);
		}
	}
};
var library = function(db, req, res, path, auth) {
	path.shift();
	if(auth) {
		if(req.method == 'GET') { // READ
			db.library.read(req.query.id || req.cookies.id, function (err, data) {
				if(!err) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'POST') { // CREATE
			db.library.create(req.body.id || req.cookies.id, req.body.book, function (err, data) {
				if(!err) {
					res.send(data);
				} 
				else {
					console.log(err + " " + data);
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'DELETE') {  // DELETE
			db.library.del(req.query.id || req.cookies.id, req.query.book, function (err) {
				if(!err) {
					res.send('OK');
				} 
				else {
					res.status(404).send();
				}
			});

		}
	}
};
var users = function(db, req, res, path, auth) {
	path.shift();
	if(auth) {
		if(req.method == 'GET') { // READ
			db.users.read(req.query.id || req.cookies.id, function (err, data) {
				if(!err) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'POST') { // CREATE
		//	db.users.create(user, data, callback);
		}
		else if(req.method == 'PUT') { // UPDATE
			db.users.update(req.body.id || req.cookies.id, req.body, function(err, data){
				if(!err) {
					res.send('OK');
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'DELETE') {  // DELETE
			db.users.logout(req.body.id || req.cookies.id, function(err, data) {
				if(!err) {
					res.send('OK');
				} 
				else {
					res.status(404).send();
				}
			});
		}
	}
};
var messages = function(db, req, res, path, auth) {
	path.shift();
	if(req.method == 'POST') {
		console.log('message');
		console.log(req.body.subject);
		if(req.body.recipient && req.body.sender) {
			var user = req.body.recipient.split('@')[0];
			console.log(user);
			db.users.findMailByUsername(user, function(err, data) {
				if(!err) {
					var mailTo = data.email;
					console.log('To: ' + data);
					db.users.findUsernameByMail(req.body.sender, function(err, data) {
						if(!err) {
						var mailFrom = data.username + '@bibliofair.com';
						console.log('From: ' + data);
						mg.sendText(mailFrom, [mailTo],
							req.body.subject,
							req.param('body-plain'),
							//req.body.body-plain,
							'bibliofair.com', {},
							function(err) {
							if (err) console.log('Oh noes: ' + err);
							else     console.log('Message sent');
							});
						}
						else {
							console.log('Err searching for sender');
						}
					});
				}
				else {
					console.log('Err searching for recipient');
				}
			});
		}
	}
};
var tel = function (req, res, path, auth) {
	path.shift();
	if(auth && req.query.q) {
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
