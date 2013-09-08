// AUTH
module.exports = function (db, req, res, callback) {
	if(req.query.id) {
		var id = req.query.id;
		var token = req.query.token;
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
				callback(true, db, req, res);
			}
		}
	});
};
