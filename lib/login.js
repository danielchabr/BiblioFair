// LOG IN
var db = require('./db');
module.exports = function (app, db) {
	return function (req, res) {
		db.users.login(req.body.email, req.body.password, function (login, hash){
			if(login) {
				res.cookie('token', hash, { maxAge: 1800000, httpOnly: true });
				res.cookie('user', req.body.email, { maxAge: 1800000, httpOnly: true });
				res.send('loginSuccess');
			}
			else {
				res.send('loginFailure');
			}
		});
	};
};
