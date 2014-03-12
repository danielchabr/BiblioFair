var mongoose = require("mongoose"),
        Book = mongoose.model("BookModel"),
        http = require('http'),
        _ = require('lodash');

var regex = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

/**
 * Count all the books in the Bibliofair database.
 * 
 * @param {function} done
 * @returns {undefined}
 */

exports.count = function(done) {
    Book.count(function(err, data) {
        done(err, data);
    });
};

/**
 * Get books specified by the options.
 * 
 * @param {object} options
 * @param {function} done
 * @returns {undefined}
 */

exports.get = function(options, done) {
    //extend defaults with the options
    options = _.extend({
        limit: 0,
        offset: 0,
        query: '',
        fields: ''
    }, options);

    if(options.lat && options.lng && options.radius){
        var re = new RegExp(regex(options.query), 'i');
        //, num_users: {$gt: 0}
        Book.find({$or: [{title: re}, {author: re}]}).where('loc.coordinates').near({center: [options.lng, options.lat], maxDistance: (options.radius / 111.12), spheriacal: true}).select(options.fields).skip(options.offset).limit(options.limit).populate('users', {"library": 1, _id: 0}, 'UserModel').exec(function(err, data) {
            done(err, data);
        });
    } else{
        var re = new RegExp(regex(options.query), 'i');
        //, num_users: {$gt: 0}
        Book.find({$or: [{title: re}, {author: re}]}).select(options.fields).skip(options.offset).limit(options.limit).populate('users', {"library": 1, _id: 0}, 'UserModel').exec(function(err, data) {
            done(err, data);
        });
    }
};

/**
 * Get a book by its id.
 * 
 * @param {ObjectId} id
 * @param {function} done
 * @returns {undefined}
 */

exports.one = function(id, done) {
    Book.load(id, function(err, data) {
        done(err, data);
    });
};

/**
 * Search for a book (currently TEL database using TEL's API).
 * 
 * @param {number} isbn
 * @param {function} done
 * @returns {undefined}
 */

exports.search = function(isbn, done) {
    var options = require('url').parse('http://data.theeuropeanlibrary.org/opensearch/json?query=' + isbn +'&apikey=ev3fbloutqdhrqe3pidpal4bav');
    options.rejectUnauthorized = false;

    var data = "";
    http.get(options, function(response) {
        response.on('data', function(i) {
            data += i;
        });
        response.on('end', function() {
            done(null, JSON.parse(data));
        });
        response.on('error', function(e) {
            console.log(e);
        });
    });
}

