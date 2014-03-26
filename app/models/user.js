'use strict';

var mongoose = require('mongoose'),
	crypto = require('crypto-js'),
	validate = require('../helpers/validation'),
	Schema = mongoose.Schema;

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
	this.findOne({_id: userId, 'library.id': bookId}, 'library').populate('library.id').exec(function(err, data) {
		if(!data){
			return done("user.notFound");
		}
		if(!data.library[0]){
			return done("book.notFound");
		}
		done(err, getBook(data.library[0]));
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
	 * Authenticate the user.
	 * 
	 * @param {String} plainText
	 * @returns {Boolean}
	 */
	authenticate: function(password) {
		return this.hashedPassword === this.encryptPassword(password);
		/*
		 //new authentication
		 if(this.encryptPassword(plainText) === this.hashedPassword){
		 return true;
		 }
		 //old authentication
		 else if(crypto.SHA3(this.email + plainText).toString() === this.oldPassword.email){            
		 this.password = plainText;
		 this.oldPassword = {};
		 return true;
		 }
		 return false;*/
	},
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
	 * Encrypt the password using existing (!!) salt.
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
	}
};

mongoose.model('UserModel', UserSchema);