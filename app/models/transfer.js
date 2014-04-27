

'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var TransferSchema = new Schema({
	/**
	 * From whom.
	 */
	from:{
		type: Schema.Types.ObjectId,
		ref: 'UserModel'
	},
	/**
	 * To whom.
	 */
	to:{
		type: Schema.Types.ObjectId,
		ref: 'UserModel'
	},
	/**
	 * What book.
	 */
	book: {
		type: Schema.Types.ObjectId,
		ref: 'BookModel'
	},
	/**
	 * When the transfer took place.
	 */
	date:{
		type: Date,
		default: Date.now
	},
	/**
	 * Related transfer.
	 * 
	 * E.g. the "borrow" transfer is related when
	 * the book is returned and vice-versa.
	 */
	related: {
		type: Schema.Types.ObjectId,
		ref: 'TransferModel'
	},
	/**
	 * Transfer type.
	 * 
	 * Right now we have only two types (permanent and temporary)
	 * but in theory we might have more in the future. It might
	 * be a better solution to be able to choose from a variety of
	 * options (lending, donation, sale, etc.)...?
	 */
	permanent: Boolean,
	/**
	 * Additional data.
	 * 
	 * Price for sales etc.
	 */
	data: {}
});

mongoose.model('TransferModel', TransferModel);
