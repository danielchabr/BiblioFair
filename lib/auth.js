module.exports = function (db, req, res, callback) {
	if(req.query.user) {
		var id = req.query.user.id;
		var token = req.query.user.token;
	} else {
		var id = req.cookies.id;
		var token = req.cookies.token;
	}
	db.users.authorize(id, token, function (err) {
		if(callback) {
			if(!err) callback(false, db, req, res);
			else callback(true, db, req, res);
		}
	});
};
