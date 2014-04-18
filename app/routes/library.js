'use strict';

var authorization = require('./middlewares/authorization.js'),
	mongoose = require("mongoose"),
	User = mongoose.model("UserModel"),
	Book = mongoose.model("BookModel");

module.exports = function(app) {

	/**
	 * Expose private API.
	 */

	app.get("/api/library", authorization.login, function(req, res, next) {
		User.findBooks(req.user._id, function(err, data) {
			if(err){
				return next(err);
			}
			res.send(data);
		});
	});

	app.post("/api/library", authorization.login, function(req, res, next) {
		//get user
		User.findById(req.user._id, function(err, user) {
			if(err || !user){
				return next(err || 'user.notFound');
			}

			//add book
			user.addBook(req.body, function(err, data) {
				if(err){
					return next(err);
				}
				res.send(data);
			});
		});

	});

	app.put("/api/library/:book", authorization.login, function(req, res, next) {
		User.findById(req.user._id, function(err, user) {
			if(err || !user.library){
				return next(err);
			}
			user.updateBook(req.params.book, req.body, function(err, data) {
				if(err){
					return next(err);
				}
				res.send(data);
			});
		});
	});

	app.delete("/api/library/:book", authorization.login, function(req, res, next) {
		User.findById(req.user._id, function(err, user) {
			if(err || !user){
				return next(err || "user.notFound");
			}
			user.removeBook(req.params.book, function(err, data) {
				if(err){
					return next(err);
				}
				res.send(data);
			});
		});
	});

	//seems as if put cannot be used on its own as a route... (you need both POST and PUT)
	app.post("/api/library/transfer", authorization.login, function(req, res, next) {
		User.findById(req.user._id, function(err, from) {
			if(err || !from){
				return next(err || "user.notFound");
			}
			User.findByUsername(req.body.to, function(err, to) {
				if(err || !to){
					return next(err || "toUser.notFound");
				}
				//check if not the same user
				if(from.username === to.username){
					return next('toUser.cannotTransferToSelf');
				}
				
				Book.findById(req.body.book, function(err, book) {
					if(err || !book){
						return next(err || "book.notFound");
					}

					if(req.body.type === "permanent"){
						from.transferBookPermanently(to, book, function(err, data) {
							if(err){
								return next(err);
							}
							res.send(data);
						});
					}
					else if(req.body.type === "temporary"){
						from.transferBookTemporarily(to, book, function(err, data) {
							if(err){
								return next(err);
							}
							res.send(data);
						});
					}
				});
			});
		});
	});

	app.post("/api/library/returned", authorization.login, function(req, res, next) {
		User.findById(req.user._id, function(err, from) {
			if(err || !from){
				return next(err || "user.notFound");
			}
			User.findById(req.body.to, function(err, to) {
				if(err || !to){
					return next(err || "toUser.notFound");
				}
				Book.findById(req.body.book, function(err, book) {
					if(err || !book){
						return next(err || "book.notFound");
					}
					//a bit confusing - from is the owner!
					from.returnedBook(to, book, function(err, data) {
						if(err){
							return next(err);
						}
						res.send(data);
					})
				});
			});
		});
	});

};