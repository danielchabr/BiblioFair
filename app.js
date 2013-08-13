var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');

var homepage = fs.readFileSync('./public/index.html', 'utf-8');

var app = express();
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.post('/signup', function(request, response) {
	console.log(request.body.email);

	response.send("Welcome "+request.body.email);
});
//app.use(function (req, res) {
//	res.redirect('/');
//});

/*
mongoose.connect('mongodb://localhost/users');
var Schema = mongoose.Schema;
var userSchema = new Schema({
		username:{ type:String, required:true, unique:true },
		email:{ type:String, required:false, unique:false },
		password:{ type:String },//required:true}
});
var User = mongoose.model('UserModel', userSchema);
var me = new User();
me.username = 'morgus';
me.save();
User.find({}, function (err, docs) {
	console.log(docs);
});
*/

app.listen(process.env.PORT || 8080);
