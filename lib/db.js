// DB API
function Uint8ClampedArray (){};
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
		}
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
var auth = function (email, token, callbacks) {
	var User = mongoose.model('UserModel');
	User.findOne({email: email}, function(err, users) {
		var error;
		if(!err && users && users.token.hash == token) {
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
exports.connect = connect;
exports.addUser = addUser;
exports.existsUser = existsUser;
exports.loginUser = loginUser;
exports.auth = auth;
