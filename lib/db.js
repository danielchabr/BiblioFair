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
};
var addUser = function (email, password) {
	var User = mongoose.model('UserModel');
	var user = new User;
	user.email = email;
	user.password = password;
	user.save();
};
var existsUser = function (email, callback) {
	var User = mongoose.model('UserModel');
	User.findOne({email: email}, function (err, users) {
		if(!users || err) callback(false);
		else callback(true);
	});
};
var loginUser = function (email, password, callback) {
	var User = mongoose.model('UserModel');
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
var logoutUser = function (email, callback) {
	var User = mongoose.model('UserModel');
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
var auth = function (email, token, callbacks) {
	var User = mongoose.model('UserModel');
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
var books = function() {
	var Schema = mongoose.Schema;
	var bookSchema = new Schema({
		name: {type:String, required:true},
		author: {type:String, required:true}
	});
	var Book = mongoose.model('BookModel', bookSchema);
	return {
		add: function(data, callback) {
			var book = new Book();
			if(data.name && data.author) {
				book.name = data.name;
				book.author = data.author;
				book.save();
				callback(true);
			} else {
				callback(false);
			}
		},
		query: function(callback) {
			Book.find({}, function(err, books) {
				callback(books);
			});
		}
	};
};
exports.connect = connect;
exports.addUser = addUser;
exports.existsUser = existsUser;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.auth = auth;
exports.books = books();
