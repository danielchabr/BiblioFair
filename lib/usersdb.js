// USER's DB
var mongoose = require('mongoose');

var connect = function () {
//	mongoose.connect('mongodb://localhost/users');
	mongoose.connect('mongodb://process.env.OPENSHIFT_MONGODB_DB_HOST:process.env.OPENSHIFT_MONGODB_DB_PORT/');

	var Schema = mongoose.Schema;
	var userSchema = new Schema({
		email:{ type:String, required:true, unique:true },
		password:{ type:String, required:true}
	});
	var User = mongoose.model('UserModel', userSchema);
};
var add = function (email, password) {
	var User = mongoose.model('UserModel');
	var user = new User;
	user.email = email;
	user.password = password;
	user.save();
};
var exists = function (email, callback) {
	var User = mongoose.model('UserModel');
	User.findOne({email: email}, function (err, users) {
		if(!users) callback(false);
		else callback(true);
	});
};
var login = function (email, password, callback) {
	var User = mongoose.model('UserModel');
	User.findOne({email: email}, function (err, users) {
		if(!users) {
			callback(false);
			return false;
		}
		if(users.password == password) {
			callback(true);
			return true;
		}
		else {
			callback(false);
			return false;
		}
	});
};
exports.connect = connect;
exports.add = add;
exports.exists = exists;
exports.login = login;
