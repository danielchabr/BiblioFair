// SIGN UP
var usersdb = require('./usersdb');
module.exports = function (app, usersdb) {
	return function (req, res) {
		usersdb.exists(req.body.email, function (exists) {
			if(exists) {
				res.send('emailExists');
			}
			else {
				usersdb.add(req.body.email, req.body.password);
				res.cookie('user', req.body.email, { maxAge: 900000, httpOnly: true });
				res.send('registered');
			}
		});
	};
};
