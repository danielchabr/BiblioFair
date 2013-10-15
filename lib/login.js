// LOG IN
module.exports = function (app, db) {
	return function (req, res) {
		db.users.login(req.body.id, req.body.password, function (err, id, hash, lang, user){
			if(!err) {
				res.cookie('token', hash, { maxAge: 18000000000, httpOnly: true });
				res.cookie('id', id.toString(), { maxAge: 18000000000, httpOnly: true });
				res.cookie('lang', lang, { maxAge: 18000000000, httpOnly: true });
				res.send({message: 'loginSuccess', lang:lang, user: user});
			}
			else {
				res.send('loginFailure');
			}
		});
	};
};
