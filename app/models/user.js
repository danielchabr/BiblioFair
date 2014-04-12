'use strict';

var mongoose = require('mongoose'),
	crypto = require('crypto-js'),
	validate = require('../helpers/validation'),
	Book = mongoose.model("BookModel"),
	Schema = mongoose.Schema;

var User;
var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		set: toLowerCase
	},
	name: String,
	hashedPassword: {
		type: String,
		select: false
	},
	salt: {
		type: String,
		select: false
	},
	token: {
		hash: String,
		last: Date
	},
	verified: {
		type: Boolean,
		default: false
	},
	remember: String,
	language: String,
	loc: {
		type: {type: String},
		coordinates: [Number]
	},
	library: [{
			id: {
				type: Schema.Types.ObjectId,
				ref: 'BookModel'
			},
			last_updated: Date,
			actions: {
				sell: Boolean,
				donate: Boolean,
				lend: Boolean
			},
			note: String
		}],
	provider: String,
	facebook: {},
	twitter: {},
	github: {},
	google: {},
	linkedin: {}
});

/**
 * Static methods.
 */

UserSchema.statics.findByRememberMeToken = function(token, done) {
	this.findOne({remember: token}, done);
};

UserSchema.statics.findByUsername = function(username, done) {
	this.findOne({username: username}, done);
};

UserSchema.statics.findBooks = function(userId, done) {
	this.findById(userId, 'library').populate('library.id').exec(function(err, data) {
		if(!data){
			return done("user.notFound");
		}

		var books = [];
		data.library.forEach(function(item) {
			books.push(getBook(item));
		});
		done(err, books);
	});
};

UserSchema.statics.findBook = function(userId, bookId, done) {
	this.findById(userId, "library").populate("library.id").exec(function(err, user){
		if(!user){
			return done("user.notFound");
		}
		
		var book;
		user.library.forEach(function(item) {
			if(item.id.toObject()._id.toString() == bookId){
				book = getBook(item);
				return;
			}
		});
		if(book){
			return done(null, book);
		}else{
			return done("book.notFound");
		}
	});
};

function getBook(item) {
	var book = item.id.toObject();
	book.actions = item.actions;
	book.note = item.note;
	book.last_updated = item.last_updated;
	return book;
}


/**
 * Validations.
 */

//valid email
UserSchema.path('email').validate(function(email, respond) {
	validate.email(email, function(err, valid) {
		if(err){
			throw err;
		}
		respond(valid);
	});
}, 'invalid');

//unique email
UserSchema.path('email').validate(function(email, respond) {
	//validate only if new
	if(!this.isNew){
		return respond(true);
	}

	mongoose.model("UserModel").findOne({email: email}, function(err, user) {
		if(err){
			throw err;
		}
		if(user){
			respond(false);
		}
		respond(true);
	});
}, 'exists');

//valid username
UserSchema.path('username').validate(function(username, respond) {
	validate.email(username + "@bibliofair.com", function(err, valid) {
		if(err){
			throw err;
		}
		respond(valid);
	});
}, 'invalid');

//unique username
UserSchema.path('username').validate(function(username, respond) {
	//validate only if new
	if(!this.isNew){
		return respond(true);
	}

	mongoose.model("UserModel").findOne({username: username}, function(err, user) {
		if(err){
			throw err;
		}
		if(user){
			respond(false);
		}
		respond(true);
	});
}, 'exists');

/**
 * Getters & setters.
 */

function toLowerCase(value) {
	return value.toLowerCase();
}

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashedPassword = this.encryptPassword(password);
}).get(function() {
	return this._password;
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
	//validate only if new and NOT via oauth (facebook, google, etc.)
	if(!this.isNew || this.provider !== 'local'){
		return next();
	}

	if(!validate.presenceOf(this.password)){
		next(new Error('password.required'));
	}
	else if(this.password.length < 6){
		next(new Error('password.short'));
	}
	else{
		next();
	}
});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Make salt.
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return crypto.lib.WordArray.random(16).toString();
	},
	/**
	 * Authenticate the user.
	 * 
	 * @param {String} plainText
	 * @returns {Boolean}
	 */
	authenticate: function(password) {
		return this.hashedPassword === this.encryptPassword(password);
	},
	/**
	 * Encrypt the password using the existing (!!) salt.
	 * 
	 * @param {String} password
	 * @returns {String} 
	 */
	encryptPassword: function(password) {
		if(!password || !this.salt){
			return '';
		}
		return crypto.SHA3(Array(10).join(this.salt) + password, {outputLength: 256}).toString();
	},
	isLocated: function() {
		return this.loc.coordinates.length === 2;
	},
	isVerified: function() {
		return this.verified;
	},
	/**
	 * Library API.
	 */

	addBook: function(newbook, done) {
		var user = this;

		//check if user can add books 			
		var canAddBooks = user.canAddBooks();
		if(canAddBooks !== true){
			return done(canAddBooks);
		}

		//delete certain properties
		['users', 'loc', 'num_users', '_id', '_v'].forEach(function(prop) {
			delete newbook[prop];
		});
		if(newbook.published) {
			newbook.published = new Date(newbook.published).getFullYear();
		}

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
	},
	canAddBooks: function() {
		//located?
		if(!this.isLocated()){
			return new Error("user.notLocated");
		}
		//verified?
		if(!this.isVerified()){
			return new Error("user.notVerified")
		}
		return true;
	},
	removeBook: function(bookId, done) {
		var user = this;
		Book.findById(bookId, function(err, book) {
			if(err || !book.users){
				return done(err || "book.notFound");
			}
			user.update({$pull: {'library': {id: bookId}}}, function(err) {
				if(err){
					return done(err);
				}

				book.users.splice(book.users.indexOf(user._id), 1);
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
	},
	transferBook: function(to, book, done) {
		var from = this;

		//check if user 'to' can add books
		var toCanAddBooks = to.canAddBooks();
		if(toCanAddBooks !== true){
			return done(toCanAddBooks);
		}

		//add book to user 'to'
		to.addBook(book, function(err, data) {
			if(err){
				return done(err);
			}
			//remove book from user 'from'
			from.removeBook(book._id, function(err) {
				return done(err, book);
			});
		});
	}
};


User = mongoose.model('UserModel', UserSchema);
