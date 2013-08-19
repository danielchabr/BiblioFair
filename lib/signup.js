// SIGN UP
var db = require('./db');
module.exports = function (app, db) {
	return function (req, res) {
		db.existsUser(req.body.email, function (exists) {
			if(exists) {
				res.send('emailExists');
			}
			else {
				db.addUser(req.body.email, req.body.password);
				res.cookie('user', req.body.email, { maxAge: 900000, httpOnly: true });
				res.send('registered');
			}
		});
	};
};
