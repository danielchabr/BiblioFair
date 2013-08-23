// SIGN UP
module.exports = function (app, db) {
	return function (req, res) {
		db.users.exists(req.body.email, function (exists) {
			if(exists) {
				res.send('emailExists');
			}
			else {
				db.users.add(req.body.email, req.body.password, function () {
					res.send('registered');
				}
				);
			}
		});
	};
};
