// AUTH
module.exports = function (db, req, res, callback) {
//	console.log(req.path + " " + req.query.id);
//	console.log(req.path + " " + req.body.id);
//	console.log(req.path + " " + req.cookies.id);
	if(req.cookies.id) {
		var id = req.cookies.id;
		var token = req.cookies.token;
	}
	else if(req.body.id) {
		var id = req.body.id;
		var token = req.body.token;
	}
	else {
		var id = req.query.id;
		var token = req.query.token;
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
