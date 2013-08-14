var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users');
var Schema = mongoose.Schema;
var userSchema = new Schema({
	email:{ type:String, required:true, unique:true },
	password:{ type:String, required:true}
});
var User = mongoose.model('UserModel', userSchema);
//   var me = new User();
//   me.save();
 //  User.find({}, function (err, docs) {
  // console.log(docs);
   //});


var app = express();
app.use(express.compress());
app.use(express.bodyParser());

app.use(express.static(__dirname + '/public'));
app.post('/signup', function(request, response) {
		User.findOne({email:request.body.email}, function (err, users) {
			if(err) {console.log(err)};
			if(!users) {
				var user = new User();
				user.email = request.body.email;
				user.password = request.body.password;
				user.save();
				response.cookie('user', request.body.email, { maxAge: 900000, httpOnly: true });
				response.send('registered');
				console.log('registered');
			}
			else {
				response.send('emailExists');
				console.log('emailExists');
			}
		});
});
app.post('/login', function(request, response) {
		User.findOne({email:request.body.email}, function (err, users) {
			if(err) {console.log(err)};
			if(!users) {
				response.send('loginFailure');
				console.log('loginFailure');
			}
			else {
				if(users.password == request.body.password){
					response.cookie('user', request.body.email, { maxAge: 900000, httpOnly: true });
					response.send('loginSuccess');
					console.log('loginSuccess');
				}
				else {
					response.send('loginFailure');
					console.log('loginFailure');
				}
			}
		});
});
app.use(function (req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 8080);

/*
   */

