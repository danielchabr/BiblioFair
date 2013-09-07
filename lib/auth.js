// AUTH
module.exports = function (db, req, res, callback) {
	if(req.query.user) {
		var user = JSON.parse(req.query.user);
		var id = user.id;
		var token = user.token;
	} else {
		var id = req.cookies.id;
		var token = req.cookies.token;
	}
	db.users.authorize(id, token, function (err) {
		if(callback) {
			if(!err) {
				callback(false, db, req, res);
			}
			else {
				console.log('unauth');
				callback(true, db, req, res);
			}
		}
	});
};
