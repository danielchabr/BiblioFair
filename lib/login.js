// LOG IN
var db = require('./db');
module.exports = function (app, db) {
	return function (req, res) {
		db.loginUser(req.body.email, req.body.password, function (login, hash){
			if(login) {
				res.cookie('token', hash, { maxAge: 900000, httpOnly: true });
				res.cookie('user', req.body.email, { maxAge: 900000, httpOnly: true });
				res.send('loginSuccess');
				console.log('loginsuccess');
			}
			else {
				res.send('loginFailure');
			}
		});
	};
};
