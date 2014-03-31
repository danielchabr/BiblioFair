'use strict';

var mongoose = require("mongoose"),
	Book = mongoose.model("BookModel"),
	User = mongoose.model("UserModel"),
	_ = require('lodash');


/**
 * Read user's library.
 * 
 * @param {ObjectId} userId user id
 * @param {function} done callback
 * @returns {undefined}
 */
exports.read = function(userId, done) {
	User.findBooks(userId, function(err, books) {
		done(err, books);
	});
};

/**
 * Add a book to user's library.
 * 
 * @param {ObjectId} userId
 * @param {object} data
 * @param {function} done
 * @returns {undefined}
 */

exports.add = function(userId, newbook, done) {
	User.findById(userId, function(err, user) {
		if(err || !user){
			return done(err || 'user.notFound');
		}
		user.addBook(newbook, done);
	});
};

/**
 * Update a book in user's library.
 * 
 * @param {ObjectId} userId
 * @param {ObjectId} bookId
 * @param {object} data
 * @param {function} done
 * @returns {undefined}
 */

exports.update = function(userId, bookId, data, done) {
	User.findById(userId, function(err, user) {
		if(err || !user.library){
			done(err);
		}
		else{
			for (var i = 0; i < user.library.length; i++){
				//different types -> == instead of ===
				if(user.library[i].id == bookId){
					if(data.actions)
						user.library[i].actions = data.actions;
					if(data.note)
						user.library[i].note = data.note;
				}
			}
			user.save(function(err, user) {
				done(err, user);
			});
		}
	});
};

/**
 * Remove a book from user's library.
 * 
 * @param {ObjectId} userId
 * @param {ObjectId} bookId
 * @param {function} done
 * @returns {undefined}
 */

exports.remove = function(userId, bookId, done) {
	User.findById(userId, function(err, user) {
		if(err || !user){
			return done(err || "user.notFound");
		}
		user.removeBook(bookId, done);
	});
};

exports.transfer = function(fromId, toId, bookId, done) {
	User.findById(fromId, function(err, from) {
		if(err || !from){
			return done(err || "user.notFound");
		}
		User.findById(toId, function(err, to) {
			if(err || !to){
				return done(err || "user.notFound");
			}
			Book.findById(bookId, function(err, book) {
				if(err || !book){
					return done(err || "book.notFound");
				}
				from.transferBook(to, book);
			});
		});
	});
};