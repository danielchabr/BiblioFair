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
	f.get = function (id, callback) {
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
	f.query = function (user, data, callback) {
		Users.findOne({email:user}, function (err, user) {
			if(!err && user) {
				if(data.loc && user.loc) {
					data.loc.lat = user.loc.lat;
					data.loc.lng = user.loc.lng;
				}
				if(callback) callback(false, data);
			}
			else {
				if(callback) callback(true);
			}
		});
	};
	f.queryBooks = function (user, data, callback) {
		Users.findOne({email:user}, 'library').populate('library.id', null, 'BookModel').exec(function (err, data) {
			if(!err && user) {
				var mybooks = [];
				for (var i = 0; i < data.library.length; i++) {
					mybooks.push(data.library[i].id);
				}
				if(callback) callback(false, mybooks);
			} else {
				if(callback) callback(true);
			}
		});
	};
	f.removeBooks = function (user, book, callback) {
		Users.findOne({email:user}, 'library').populate('library.id', null, 'BookModel').exec(function (err, data) {
			if(!err && user) {
				for (var i = 0; i < data.library.length; i++) {
					if(data.library[i].id.title == book.title && data.library[i].id.author == book.author) {
						data.library.splice(i, 1);
					}
				}
				data.save();
				if(callback) callback(false);
			} else {
				if(callback) callback(true);
			}
		});
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
	f.addBooks = function(user, book_id, callback) {
		Users.findOne({email: user}, function (err, user) {
			if(!err && user && book_id) {
				user.library.push({id:book_id, last_updated: new Date()});
				user.save();
				if(callback) callback(false);
			}
			else {
				if(callback) callback(true);
			}
		});
	};
	f.findId = function(user, callback) {
		Users.findOne({email: user}, function (err, user) {
			if(!user || err) ;
			else
			callback(user._id);
		});
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
///////  BOOKS   /////////
var books_f = function() {
		var f = {};
	f.add = function(this_user, data, callback) {
		var book = new Books();
		if(data.title && data.author) {
			book.title = data.title;
			book.author = data.author;
			if(data.subtitle) book.subtitle = data.subtitle;
			if(data.publisher) book.publisher = data.publisher;
			if(data.language) book.language = data.language;
			if(data.edition) book.edition = data.edition;
			if(data.volume) book.volume = data.volume;
			if(data.isbn) book.isbn = data.isbn;
			users.findId(this_user, function(id) {
				if(id) {
					book.users.push(id);
				}
				book.save();
				users.addBooks(this_user, book._id);
				callback(true);
			});
		} else {
			callback(false);
		}
	};
	f.read = function (fields, query, limit, offset, callback) {
		var re = new RegExp(query, 'i');
		//Books.find({title: re}).exec(callback);
		Books.find({ $or: [{title: re},{author: re}]}).select(fields).skip(offset || 0).limit(Number(limit) || 10).exec(callback);
	};
	f.query = function(callback) {
		Books.find({ users: {$exists: true, $size: "1"}}, function(err, books) {
			callback(books);
		});
	};
	f.querymy = function(this_user, callback) {
		users.findId(this_user, function(id) {
			if(id) {
				Books.find({users: { $in : [id]}}, function(err, books) {
					callback(books);
				});

			}
		});
	};
	return f;
};
var books = books_f();
exports.connect = connect;
exports.books = books;
exports.users = users;
