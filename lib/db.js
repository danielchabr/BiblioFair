// DB
var crypt = require('crypto-js');
var mongoose = require('mongoose');
var valid = require('./validate');

var connect = function () {
	if(process.env.OPENSHIFT_MONGODB_DB_HOST) {
		var host = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.10.110.2';
		mongoose.connect('mongodb://admin:admin@' + host + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/');
	}
	else {
		mongoose.connect('mongodb://localhost/swapify');
	}
};
var models = require('./models')(mongoose);
var Users = models.Users;
var Books = models.Books;

///////  USER   /////////
var users_f = function() {
	var f = {};
	f.read = function (id, callback) {
		Users.findById(id, ['username', 'loc', 'library'].join(' ')).exec(callback);
	};
	f.update = function (id, data, callback) {
		Users.findByIdAndUpdate(id, {"loc.coordinates" : data.loc, "loc.type": "Point"}, callback);
	};
	f.verify = function (data, callback) {
		Users.findOne({'token.hash': data}, function (err, user) {
			if(!err && user) {
				user.password = user.password.substr(0,user.password.length-1);
				user.save();
				if(callback) callback(false);
			}
			else {
				if(callback) callback(true);
			}
		})
	};
	f.add = function (email, password, callback) {
		if(email && password) {
			var user = new Users;
			user.email = email;
			user.password = password + 'x';
			var token = crypt.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString();
			user.token.hash = token;
			user.token.last = new Date();
			user.save();
			callback(false, token);
		}
		else {
			callback(true, token);
		}
	};
	f.exists = function (email, callback) {
		valid.email(email, function(err, email) {
			Users.findOne({email: email}, function (err, users) {
				if(users || err || !email) callback(true);
				else callback(false);
			});
		});
	};
	f.login = function (email, password, callback) {
		if(valid.email(email)) {
			Users.findOne({email: email}, function (err, user) {
				if(user && !err && user.password == password) {
					var token = crypt.SHA3(Date.parse(new Date()).toString() + user.password, {outputLength: 512}).toString();
					user.token.hash = token;
					user.token.last = new Date();
					user.save();
					callback(false, user._id, token);
				}
				else {
					callback(true);
				}
			});
		}
		else {
			callback(false, token);
			return false;
		}
	};
	f.authorize = function (id, token, callback) {
		Users.findById(id, 'token', function (err, user) {
			if(!err && user && user.token.hash == token) {
				if(callback) callback(false);
			}
			else {
				if(callback) callback(true);
			}
		});
	};
	f.logout = function (email, callback) {
		Users.findOne({email: email}, function (err, user) {
			if(!err && user && user.token.hash) {
				user.token.hash = null;
				user.token.last = new Date();
				user.save();
				if(callback) callback(true);
			}
			else {
				if(callback) callback(false);
			}
		});
	};
	return f;
};
var users = users_f();
/////// LIBRARY /////////
var library_f = function () {
	var f = {};
	f.read = function (id, callback) {
		Users.findById(id, 'library').populate('library.id', null, 'BookModel').exec(callback);

	};
	f.create = function (id, data, callback) {
		Users.findById(id, function (err, user) {
			if(!err && user && data.author && data.title) {
				var book_id;
				var newbook = {author:data.author, title:data.title};
				if(data.subtitle) newbook.subtitle = data.subtitle;
				if(data.publisher) newbook.publisher = data.publisher;
				if(data.published) newbook.published = data.published;
				if(data.language) newbook.language = data.language;
				if(data.edition) newbook.edition = data.edition;
				if(data.volume) newbook.volume = data.volume;
				if(data.isbn) newbook.isbn = data.isbn;
				Books.find(newbook).limit(1).exec(function(err, book) {
					if(!err && book.length == 1) {
						book[0].users.push(user._id);
						book[0].save();
						user.library.push({id:book[0]._id, last_updated: new Date()});
						user.save(book[0]);
						callback(false, book[0]);
					}
					else {
						var book = new Books();
						book.author = newbook.author;
						book.title = newbook.title;
						book.subtitle = newbook.subtitle;
						book.publisher = newbook.publisher;
						book.published = newbook.published;
						book.language = newbook.language;
						book.edition = newbook.edition;
						book.volume = newbook.volume;
						book.isbn = newbook.isbn;
						book.save();
						user.library.push({id:book._id, last_updated: new Date()});
						user.save();
						callback(false, book);
					}
				});
			}
			else {
				callback(true);
			}
		});
	};
	f.del = function (id, book_id, callback) {
		Users.findById(id, function(err, user) {
			if(!err && user.library) {
				Books.findById(book_id, function(err, book) {
					if(!err && book.users) {
						user.library.splice(user.library.indexOf({id: book_id}), 1);
						book.users.splice(book.users.indexOf(id), 1);
						user.save();
						book.save();
						callback(false);
					}
					else { callback(true);}
				});
			}
			else { callback(true);}
		});
	};
	return f;
}
var library = library_f();
///////  BOOKS   /////////
var books_f = function() {
	var f = {};
	f.read = function (fields, query, limit, offset, callback) {
		var re = new RegExp(query, 'i');
		Books.find({ $or: [{title: re},{author: re}]}).select(fields).skip(offset || 0).limit(Number(limit) || 10).exec(callback);
	};
	return f;
};
var books = books_f();
exports.connect = connect;
exports.books = books;
exports.users = users;
exports.library = library;
