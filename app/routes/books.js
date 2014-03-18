'use strict';

var books = require("../api/books"),
				authorization = require("./middlewares/authorization");

module.exports = function(app) {

	/**
	 * Expose public API.
	 */

	app.get("/api/books/count", function(req, res, next) {
		books.count(function(err, data) {
			if(err){
				next(err);
			}
			else{
				res.send(data.toString());
			}
		});
	});
	app.get("/api/books/:id", function(req, res) {
		books.one(req.params.id, function(err, data) {
			if(err){
				res.status(404);
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});
	app.post("/api/books", function(req, res) {
		books.get(req.body, function(err, data) {
			if(err){
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	/**
	 * Expose private API.
	 */

	app.get("/api/books/search/:query", authorization.login, function(req, res) {
		books.search(req.params.query, function(err, data) {
			if(err){
				res.status(404);
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.post("/api/books/request", authorization.login, function(req, res) {
		books.request(req.body.from, req.body.to, req.body.book, req.body.language, function(err, data) {
			if(err){
				res.status(404);
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});

	app.get("/api/books/report/:book", authorization.login, function(req, res) {
		books.report(req.user._id, req.params.book, function(err, data) {
			if(err){
				res.status(404);
				next(err);
			}
			else{
				res.send(data);
			}
		});
	});
};