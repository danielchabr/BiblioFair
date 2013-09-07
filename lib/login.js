// LOG IN
module.exports = function (app, db) {
	return function (req, res) {
		db.users.login(req.body.email, req.body.password, function (err, id, hash){
			if(!err) {
				res.cookie('token', hash, { maxAge: 18000000000, httpOnly: true });
				console.log(id);
				res.cookie('id', id.toString(), { maxAge: 18000000000, httpOnly: true });
				res.send('loginSuccess');
			}
			else {
				res.send('loginFailure');
			}
		});
	};
};
