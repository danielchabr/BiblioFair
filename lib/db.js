// DB API
var crypt = require('crypto-js');
var mongoose = require('mongoose');

var connect = function () {
	if(process.env.OPENSHIFT_MONGODB_DB_HOST) {
		var host = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.10.110.2';
		mongoose.connect('mongodb://admin:admin@' + host + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/');
	}
	else {
		mongoose.connect('mongodb://localhost/swapify');
	}
};
///////  USER   /////////
var users_f = function() {
	var Schema = mongoose.Schema;
	var userSchema = new Schema({
		email:{ type:String, required:true, unique:true },
		password:{ type:String, required:true},
		token:{	
			hash:{ type:String, required:false},
		last:{ type:Date, required:false}
		},
		books:[{ type: Schema.Types.ObjectId, ref: 'Book'}]
	});
	var User = mongoose.model('UserModel', userSchema);
	var f = {};
	f.add = function (email, password, callback) {
		if(email && password) {
			var user = new User;
			user.email = email;
			user.password = password;
			user.save();
			callback();
		}
	};
	f.addBook = function(user, data, callback) {
	};
	f.findId = function(user, callback) {
		User.findOne({email: user}, function (err, user) {
			if(!user || err) ;
			else
			callback(user._id);
		});
	};
	f.exists = function (email, callback) {
		User.findOne({email: email}, function (err, users) {
			if(!users || err) callback(false);
			else callback(true);
		});
	};
	f.login = function (email, password, callback) {
		User.findOne({email: email}, function (err, user) {
			if(!user || err) {
				callback(false, token);
				return false;
			}
			if(user.password == password) {
				var token = crypt.SHA3(Date.parse(new Date()).toString() + user.password, {outputLength: 512}).toString();
				user.token.hash = token;
				user.token.last = new Date();
				user.save()
			callback(true, token);
		return true;
			}
			else {
				callback(false, token);
				return false;
			}
		});
	};
	f.auth = function (email, token, callbacks) {
		User.findOne({email: email}, function(err, user) {
			var error;
			if(!err && user && user.token.hash == token) {
				error = false;
			}
			else {
				error = true;
			}
		if(Array.isArray(callbacks)) {
			for (callback in callbacks) {
				callback(error);
			}
		}
		else {
			callbacks(error);
		}
		});
	};
	f.logout = function (email, callback) {
		User.findOne({email: email}, function (err, user) {
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
	var Schema = mongoose.Schema;
	var bookSchema = new Schema({
		name: {type:String, required:true},
		author: {type:String, required:true},
		users: [{ type: Schema.Types.ObjectId, ref: 'User'}]
	});
	var Book = mongoose.model('BookModel', bookSchema);
	var f = {};
	f.add = function(this_user, data, callback) {
		var book = new Book();
		if(data.name && data.author) {
			book.name = data.name;
			book.author = data.author;
			users.findId(this_user, function(id) {
				if(id) {
					book.users.push(id);
				}
				book.save();
				callback(true);
			});
		} else {
			callback(false);
		}
	};
	f.query = function(callback) {
		Book.find({}, function(err, books) {
			callback(books);
		});
	};
	f.querymy = function(this_user, callback) {
		users.findId(this_user, function(id) {
			if(id) {
				Book.find({users: { $in : [id]}}, function(err, books) {
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
