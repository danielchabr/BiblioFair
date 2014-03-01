'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var BookSchema = new Schema({
    title:{type:String, required:true},
    author:{type:String, required:true},
    subtitle:{type:String, required:false},
    publisher:{type:String, required:false},
    published:{type:Date, required:false},
    language:{type:String, required:false},
    edition:{type:String, required:false},
    volume:{type:String, required:false},
    isbn:{type:Number, required:false},
    users:[{type:Schema.Types.ObjectId, ref:'Users'}],
    loc:[{
            coordinates:{type:[Number], index:'2d'}
        }],
    num_users:{type:Number, required:false}
});

/**
 * Static methods
 */
BookSchema.statics.load = function(id, callback) {
    this.findById(id).populate('users', 'username loc library', 'UserModel').exec(callback);
};

mongoose.model('BookModel', BookSchema);