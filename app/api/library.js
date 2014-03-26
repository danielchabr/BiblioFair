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
		//verified?
		if(!user.verified){
			return done('user.notVerified');
		}
		//location
		if(!user.isLocated()){
			return done('user.notLocated');
		}

		//delete certain properties
		['users', 'loc', 'num_users', '_id', '_v'].forEach(function(prop) {
			delete newbook[prop];
		});
		newbook.published = new Date(newbook.published);

		//search only by ceratin properties
		var book = {};
		['title', 'author', 'subtitle', 'publisher', 'published', 'language', 'edition', 'volume', 'isbn'].forEach(function(prop) {
			if(newbook[prop]){
				book[prop] = newbook[prop];
			}
		});
		Book.findOne(book).exec(function(err, book) {
			if(err){
				return done(err);
			}

			if(!book){
				book = new Book(newbook);
				book.num_users = 0;
			}

			book.users.push(user._id);
			book.num_users++;
			book.loc.push({coordinates: user.loc.coordinates});
			book.save(function(err, book) {
				if(err){
					return done(err);
				}
				user.library.push({
					id: book._id,
					last_updated: new Date(),
					actions: newbook.actions,
					note: newbook.note
				});
				user.save(function(err, user) {
					if(err){
						return done(err);
					}
					User.findBook(user._id, book._id, function(err, book) {
						done(err, book);
					});
				});
			});

		});
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
		Book.findById(bookId, function(err, book) {
			if(err || !book.users){
				return done(err, "book.notFound");
			}
			user.update({$pull: {'library': {id: bookId}}}, function(err) {
				if(err){
					return done(err);
				}

				book.users.splice(book.users.indexOf(userId), 1);
				book.loc.splice(book.loc.indexOf({coordinates: user.loc.coordinates}), 1);
				book.num_users--;
				user.save(function(err, user) {
					if(err){
						return done(err);
					}
					book.save(function(err, book) {
						done(err, book);
					});
				});
			});
		});
	});
};