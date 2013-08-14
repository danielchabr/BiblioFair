// LOG IN
var usersdb = require('./usersdb');
module.exports = function (app, usersdb) {
	return function (req, res) {
		usersdb.authenticate(req.body.email, req.body.password, function (auth){
			if(auth) {
				res.cookie('user', req.body.email, { maxAge: 900000, httpOnly: true });
				res.send('loginSuccess');
				console.log('loginSuccess');
			}
			else {
				res.send('loginFailure');
				console.log('loginFailure');
			}
		});
	};
};
