// DB API
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
		loc: { 
			lat:{type:Number, required:false},
			lng: {type:Number, required:false}
		},
		library:[{
			id:{ type: Schema.Types.ObjectId, ref: 'Book'},
			last_updated:{ type:Date, required:false},
			price: { 
				sell: {type:Number, required:false},
				rent: {type:Number, required:false}
			},
			condition: {type:Number, required:false}
		}]
	});
	var User = mongoose.model('UserModel', userSchema);
	var f = {};
	f.update = function (user, data, callback) {
		User.findOne({email:user}, function (err, user) {
			if(!err && user) {
				if(data.loc && data.loc.lat && data.loc.lng) {
					user.loc.lat = data.loc.lat;
					user.loc.lng = data.loc.lng;
				}
				user.save();
				if(callback) callback(false);
			}
			else {
				if(callback) callback(true);
			}
		});
	};
	f.verify = function (data, callback) {
		User.findOne({'token.hash': data}, function (err, user) {
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
		User.findOne({email:user}, function (err, user) {
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
	f.add = function (email, password, callback) {
		if(email && password) {
			var user = new User;
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
		valid.email(email, function(err, email) {
			User.findOne({email: email}, function (err, users) {
				if(users || err || !email) callback(true);
				else callback(false);
			});
		});
	};
	f.login = function (email, password, callback) {
		if(valid.email(email)) {
			User.findOne({email: email}, function (err, user) {
				if(user && !err && user.password == password) {
					var token = crypt.SHA3(Date.parse(new Date()).toString() + user.password, {outputLength: 512}).toString();
					user.token.hash = token;
					user.token.last = new Date();
					user.save();
					callback(true, token);
					return true;
				}
				else {
					callback(false, token);
					return false;
				}
			});
		}
		else {
			callback(false, token);
			return false;
		}
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
		title: {type:String, required:true},
		author: {type:String, required:true},
		publisher: {type:String, required:false},
		published: {type:Date, required:false},
		language: {type:String, required:false},
		edition: {type:String, required:false},
		volume: {type:String, required:false},
		isbn10: {type:Number, required:false},
		isbn13: {type:Number, required:false},
		users: [{ type: Schema.Types.ObjectId, ref: 'User'}]
	});
	var Book = mongoose.model('BookModel', bookSchema);
	var f = {};
	f.add = function(this_user, data, callback) {
		var book = new Book();
		if(data.title && data.author) {
			book.title = data.title;
			book.author = data.author;
			if(data.publisher) book.publisher = data.publisher;
			if(data.language) book.language = data.language;
			if(data.edition) book.edition = data.edition;
			if(data.volume) book.volume = data.volume;
			if(data.isbn10) book.isbn10 = data.isbn10;
			if(data.isbn13) book.isbn13 = data.isbn13;
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
