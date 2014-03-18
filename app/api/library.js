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
		User.findById(userId, 'library').populate('library.id').exec(function(err, data) {
				done(err, data);
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

exports.add = function(userId, data, done) {
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
						return done('user.notLocated')
				}

				var newbook = {author: data.author, title: data.title};
				if(data.subtitle)
						newbook.subtitle = data.subtitle;
				if(data.publisher)
						newbook.publisher = data.publisher;
				if(data.published){
						newbook.published = new Date(data.published, 1, 1);
				}
				if(data.language)
						newbook.language = data.language;
				if(data.edition)
						newbook.edition = data.edition;
				if(data.volume)
						newbook.volume = data.volume;
				if(data.isbn)
						newbook.isbn = data.isbn;
				Book.findOne(newbook).exec(function(err, book) {
						if(err){
								done(err);
						}
						else if(book){
								book.users.push(user._id);
								book.num_users = book.num_users + 1;
								book.loc.push({coordinates: user.loc.coordinates});
								book.save();
								user.library.push({id: book._id, last_updated: new Date(), actions: data.actions, note: data.note});
								user.save();
								done(err, book);
						}
						else{
								var book = new Book();
								book.author = newbook.author;
								book.title = newbook.title;
								book.subtitle = newbook.subtitle;
								book.publisher = newbook.publisher;
								book.published = newbook.published;
								book.language = newbook.language;
								book.edition = newbook.edition;
								book.volume = newbook.volume;
								book.isbn = newbook.isbn;
								book.users.push(user._id);
								book.loc.push({coordinates: user.loc.coordinates});
								book.num_users = 1;
								book.save(function(err, book) {
										if(err){
												return done(err);
										}
										user.library.push({id: book._id, last_updated: new Date(), actions: data.actions, note: data.note});
										user.save(function(err, user) {
												done(err, book);
										});
								});
						}
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