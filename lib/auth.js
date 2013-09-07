module.exports = function (db, req, res, callback) {
	db.users.authorize(req.query.id, req.query.key, function (err) {
		if(callback) {
			if(!err) callback(db, req, res, true);
			else callback(db, req, res, false);
		}
	});
};
