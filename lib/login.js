// LOG IN
var usersdb = require('./usersdb');
module.exports = function (app, usersdb) {
	return function (req, res) {
		usersdb.login(req.body.email, req.body.password, function (login){
			if(login) {
				res.cookie('user', req.body.email, { maxAge: 900000, httpOnly: true });
				res.send('loginSuccess');
			}
			else {
				res.send('loginFailure');
			}
		});
	};
};
