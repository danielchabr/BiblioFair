'use strict';

var library = require("../api/library"),
	authorization = require('./middlewares/authorization.js');

module.exports = function(app) {

	/**
	 * Expose private API.
	 */

	app.get("/api/library", authorization.login, function(req, res, next) {
		library.read(req.user._id, function(err, data) {
			if(err){
				return next(err);
			}
			res.send(data);
		});
	});

	app.post("/api/library", authorization.login, function(req, res, next) {
		library.add(req.user._id, req.body, function(err, data) {
			if(err){
				return next(err);
			}
			res.send(data);
		});
	});

	app.put("/api/library/:book", authorization.login, function(req, res, next) {
		library.update(req.user._id, req.params.book, req.body, function(err, data) {
			if(err){
				return next(err);
			}
			res.send(data);
		});
	});

	app.delete("/api/library/:book", authorization.login, function(req, res, next) {
		library.remove(req.user._id, req.params.book, function(err, data) {
			if(err){
				return next(err);
			}
			res.send(data);
		});
	});

};