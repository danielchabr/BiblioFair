'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var BookSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    subtitle:String,
    publisher:String,
    published:String,
    language:String,
    edition:String,
    volume:String,
    isbn:String,
    users:[{
            type:Schema.Types.ObjectId,
            ref:'UserModel'
        }],
    loc:[{
            coordinates:{
                type:[Number],
                index:'2d'}
        }],
    num_users:Number,
	last_added:Date
});

/**
 * Static methods
 */
BookSchema.statics.load = function(id, callback) {
    this.findById(id).populate('users', 'username loc library', 'UserModel').exec(callback);
};

mongoose.model('BookModel', BookSchema);
