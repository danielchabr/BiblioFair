// DB
'use strict';
var crypt = require('crypto-js');
var mongoose = require('mongoose');
var valid = require('./validate');

var db = mongoose.connection;
db.on('error', function(error) {
	console.error('Error in MongoDb connection: ' + error);
	mongoose.disconnect();
});
db.on('disconnected', function() {
	console.log('MongoDB disconnected!');
	//mongoose.connect(dbURI, {server:{auto_reconnect:true}});
	connect();
});
var connect = function() {
	if(process.env.OPENSHIFT_MONGODB_DB_HOST && process.env.OPENSHIFT_MONGODB_DB_PORT == '27017'){
		var host = process.env.OPENSHIFT_MONGODB_DB_HOST || '127.10.110.2';
		mongoose.connect('mongodb://admin:admin@' + host + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/');
	} else if(process.env.OPENSHIFT_MONGODB_DB_HOST){
		var host = process.env.OPENSHIFT_MONGODB_DB_HOST;
		mongoose.connect('mongodb://admin:xiUk5TI6tEbv@' + host + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/');
		console.log('DB connected;\nHost: ' + host + '\nPort: ' + process.env.OPENSHIFT_MONGODB_DB_PORT);
	} else{
		mongoose.connect('mongodb://localhost/bibliofair');
	}
//	mongoose.set('debug', true);
};
var models = require('./models')(mongoose);
var Users = models.Users;
var Books = models.Books;

///////  USER   /////////
var users_f = function() {
	var f = {};
	f.read = function(id, callback) {
		Users.findById(id, ['username', 'email', 'loc', 'library', 'language'].join(' ')).exec(callback);
	};
	f.findMailByUsername = function(user, callback) {
		if(user){
			Users.findOne({username: new RegExp("^" + user + "$", "i")}, 'email language').exec(callback);
		}
		else
			callback(true);
	};
	f.findUsernameByMail = function(mail, callback) {
		if(mail){
			Users.findOne({email: mail}, 'username', callback);
		}
		else
			callback(true);
	};
	f.passwordRecovery = function(email, callback) {
		if(email){
			Users.findOne({email: email}, 'username email language password', function(err, user) {
				console.log(err + " " + user);
				if(!err && user){
					var pass = crypt.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString().slice(0, 8);
					console.log(pass);
					user.password.username = crypt.SHA3(pass + user.username, {outputLength: 256}).toString();
					user.password.email = crypt.SHA3(pass + user.email, {outputLength: 256}).toString();
					user.save();
					callback(false, {username: user.username, language: user.language, password: pass});
				}
				else{
					console.log('errr');
					callback(true);
				}
			});
		}
		else{
			callback(true);
		}
	};
	f.update = function(id, data, callback) {
		if(data.action == 'loc' && data.loc && data.loc.length == 2){
			Users.findById(id).populate('library.id', null, 'BookModel').exec(function(err, user) {
				if(!err && user){
					for (var i = 0; i < user.library.length; i++){
						for (var j = 0; j < user.library[i].id.loc.length; j++){
							if(user.library[i].id.loc[j].coordinates[0] == user.loc.coordinates[0] && user.library[i].id.loc[j].coordinates[1] == user.loc.coordinates[1]){
								user.library[i].id.loc[j].coordinates = data.loc;
							}
							user.library[i].id.save();
						}
					}
					user.update({"loc.coordinates": data.loc, "loc.type": "Point"}).exec(callback);
				} else{
					callback(true);
				}
			});
		}
		else if(data.action == 'pass' && data.password_username && data.password_email){
			Users.findById(id, function(err, user) {
				if(!err && user && user.password.username == data.old_password_username && user.password.email == data.old_password_email){
					user.password.username = data.password_username;
					user.password.email = data.password_email;
					console.log('changing pass');
					user.save();
					callback(false, 'OK');
				}
				else{
					console.log('err');
					callback(true);
				}
			});
		}
		else if(data.action == 'lang' && (data.lang == 'en' || data.lang == 'cz')){
			Users.findByIdAndUpdate(id, {"language": data.lang}, callback);
		}
		else{
			callback(true);
		}
	};
	// EMAIL VERIFICATION
	f.verify = function(data, callback) {
		Users.findOne({'token.hash': data}, function(err, user) {
			if(!err && user && user.password.username[user.password.username.length - 1] == 'x'){
				user.password.username = user.password.username.substr(0, user.password.username.length - 1);
				user.password.email = user.password.email.substr(0, user.password.email.length - 1);
				var token = crypt.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 512}).toString();
				user.token.hash = token;
				user.token.last = new Date();
				user.save();
				console.log('verified');
				if(callback)
					callback(false, user._id, token);
			}
			else{
				if(callback)
					callback(true);
			}
		})
	};
	// CREATE USER ACCOUNT
	f.add = function(username, email, password_username, password_email, lang, callback) {
		if(username && email && password_username && password_email){
			var user = new Users;
			user.username = username;
			user.email = email.toLowerCase();
			user.password.username = password_username + 'x';
			user.password.email = password_email + 'x';
			var token = crypt.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 256}).toString();
			user.token.hash = token;
			user.token.last = new Date();
			if(lang == 'en' || lang == 'cz'){
				user.language = lang;
			}
			user.save();
			callback(false, token);
		}
		else{
			callback(true, token);
		}
	};
	f.exists = function(email, username, callback) {
		valid.email(email, function(err) {
			if(err){
				callback(true, 'invalidEmail');
				return;
			}
			valid.email(username + "@bibliofair.com", function(err) {
				if(err){
					callback(true, 'invalidUsername');
					return;
				}
				var expiryTime = new Date(new Date() - (30 * 60 * 1000));
				Users.remove({"password.username": /x$/, "token.last": {$lt: expiryTime}}, function(err, users) {
					console.log(users);
				});// delete all expired
				Users.findOne({email: email.toLowerCase()}, function(err, users) {
					if(!err && !users){
						Users.findOne({username: new RegExp("^" + username + "$", "i")}, function(err, users) {
							if(!err && !users){
								callback(false, 'OK');
							}
							else{
								callback(true, 'usernameExists');
							}
						});
					}
					else{
						callback(true, 'emailExists');
					}
				});
			});
		});
	};
	f.login = function(id, password, callback) {
		Users.findOne({$or: [{email: id}, {username: id}]}, function(err, user) {
			if(user && !err){
				if((user.email == id && user.password.email == password) || (user.username == id && user.password.username == password)){
					var token = crypt.SHA3(Date.parse(new Date()).toString() + user.email, {outputLength: 512}).toString();
					user.token.hash = token;
					user.token.last = new Date();
					user.save();
					callback(false, user._id, token, user.language, {username: user.username, email: user.email, library: user.library, loc: user.loc});
				}
				else{
					callback(true);
				}
			}
			else{
				callback(true);
			}
		});
	};
	f.authorize = function(id, token, callback) {
		Users.findById(id, 'token', function(err, user) {
			if(!err && user && user.token.hash == token){
				if(callback)
					callback(false, 'OK');
			}
			else{
				if(callback)
					callback(true);
			}
		});
	};
	f.logout = function(id, callback) {
		Users.findById(id, function(err, user) {
			if(!err && user){
				user.token.hash = null;
				user.token.last = new Date();
				user.save();
				if(callback)
					callback(false, 'OK');
			}
			else{
				if(callback)
					callback(true);
			}
		});
	};
	return f;
};
var users = users_f();
/////// LIBRARY /////////
var library_f = function() {
	var f = {};
	f.read = function(id, callback) {
		Users.findById(id, 'library').populate('library.id', null, 'BookModel').exec(callback);

	};
	f.create = function(id, data, callback) {
		Users.findById(id, function(err, user) {
			if(!err && user && data.author && data.title && user.loc.coordinates.length == 2){
				var book_id;
				var newbook = {author: data.author, title: data.title};
				if(data.subtitle)
					newbook.subtitle = data.subtitle;
				if(data.publisher)
					newbook.publisher = data.publisher;
				if(data.published){
					newbook.published = new Date(data.published, 1, 1);
				}
				if(data.language)
					newbook.language = data.language;
				if(data.edition)
					newbook.edition = data.edition;
				if(data.volume)
					newbook.volume = data.volume;
				if(data.isbn)
					newbook.isbn = data.isbn;
				Books.find(newbook).limit(1).exec(function(err, book) {
					if(!err && book.length == 1){
						book[0].users.push(user._id);
						book[0].num_users = book[0].num_users + 1;
						book[0].loc.push({coordinates: user.loc.coordinates});
						book[0].save();
						user.library.push({id: book[0]._id, last_updated: new Date(), actions: data.actions, note: data.note});
						user.save();
						callback(false, book[0]);
					}
					else{
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
						book.users.push(user._id);
						book.loc.push({coordinates: user.loc.coordinates});
						book.num_users = 1;
						book.save();
						user.library.push({id: book._id, last_updated: new Date(), actions: data.actions, note: data.note});
						user.save();
						callback(false, book);
					}
				});
			}
			else{
				callback(true);
			}
		});
	};
	f.update = function(id, book_id, data, callback) {
		Users.findById(id, function(err, user) {
			if(!err && user.library){
				for (var i = 0; i < user.library.length; i++){
					if(user.library[i].id == book_id){
						if('actions' in data)
							user.library[i].actions = data.actions;
						if('note' in data)
							user.library[i].note = data.note;
					}
				}
				user.save();
				callback(false);
			}
			else{
				callback(true);
			}
		});
	};
	f.del = function(id, book_id, callback) {
		Users.findById(id, function(err, user) {
			if(!err && user.library){
				Books.findById(book_id, function(err, book) {
					if(!err && book.users){
						//WRONG user.library.splice(user.library.indexOf({id: book_id}), 1);
						user.update({$pull: {library: {id: book_id}}}, function() {
							book.users.splice(book.users.indexOf(id), 1);
							book.loc.splice(book.loc.indexOf({coordinates: user.loc.coordinates}), 1);
							book.num_users = book.num_users - 1;
							user.save();
							book.save();
							callback(false, 'OK');
						});
					}
					else{
						callback(true);
					}
				});
			}
			else{
				callback(true);
			}
		});
	};
	return f;
}
var library = library_f();
///////  BOOKS   /////////
var books_f = function() {
	var f = {};
	RegExp.escape = function(s) {
		return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
	};
	f.read = function(fields, query, limit, offset, lat, lng, radius, callback) {
		if(lat && lng && radius){
			var re = new RegExp(RegExp.escape(query), 'i');
			//Books.find({ $or: [{title: re},{author: re}], num_users: { $gt: 0 } }).select(fields).skip(offset || 0).limit(Number(limit) || 12).exec(function(err, data){console.log(data.length);});
			//Books.find({ $or: [{title: re},{author: re}], num_users: { $gt: 0 } }).where('loc.coordinates').within({ center: [lng, lat], radius: (radius/6371), spherical:true}).select(fields).skip(offset || 0).limit(Number(limit) || 12).exec(function(err, data) {console.log(data.length);callback(err, data);});
			Books.find({$or: [{title: re}, {author: re}], num_users: {$gt: 0}}).where('loc.coordinates').near({center: [lng, lat], maxDistance: (radius / 111.12), spheriacal: true}).select(fields).skip(offset || 0).limit(Number(limit) || 12).populate('users', {"library": 1, _id: 0}, 'UserModel').exec(function(err, data) {
				callback(err, data);
			});
		} else{
			var re = new RegExp(RegExp.escape(query), 'i');
			Books.find({$or: [{title: re}, {author: re}], num_users: {$gt: 0}}).select(fields).skip(offset || 0).limit(Number(limit) || 12).populate('users', {"library": 1, _id: 0}, 'UserModel').exec(callback);
		}
	};
	f.readById = function(id, callback) {
		Books.findById(id).populate('users', 'username loc library', 'UserModel').exec(callback);
	};
	f.count = function(callback) {
		Books.count({}, function(err, count) {
			callback(err, count);
		});
	};
	return f;
};
var books = books_f();
exports.connect = connect;
exports.books = books;
exports.users = users;
exports.library = library;
