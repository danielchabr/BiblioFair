var mongoose = require("mongoose"),
        Book = mongoose.model("BookModel"),
        _ = require('lodash');

RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = function(app) {
    /**
     * Count all the books in the Bibliofair database.
     */
    app.get("/api/books/count", function(req, res) {
        Book.count(function(err, data) {
            if (err) {
                res.send(err);
            }
            res.send(data.toString());
        });
    });
    /**
     * Get a book by its id.
     */
    app.get("/api/books/:id", function(req, res) {
        Book.load(req.params.id, function(err, data) {
            if (!err && data) {
                res.send(data);
            }
            else {
                res.status(404).send();
            }
        });
    });
    /**
     * Get books specified by the data in the POST request.
     */
    app.post("/api/books", function(req, res) {
        //extend defaults with the req.body (POST data)
        var params = _.extend({
            limit:0,
            offset:0,
            query: '',
            fields: ''
        }, req.body);

        if (params.lat && params.lng && params.radius) {
            var re = new RegExp(RegExp.escape(params.query), 'i');
            //Books.find({ $or: [{title: re},{author: re}], num_users: { $gt: 0 } }).select(fields).skip(offset || 0).limit(Number(limit) || 12).exec(function(err, data){console.log(data.length);});
            //Books.find({ $or: [{title: re},{author: re}], num_users: { $gt: 0 } }).where('loc.coordinates').within({ center: [lng, lat], radius: (radius/6371), spherical:true}).select(fields).skip(offset || 0).limit(Number(limit) || 12).exec(function(err, data) {console.log(data.length);callback(err, data);});
            Book.find({$or:[{title:re}, {author:re}], num_users:{$gt:0}}).where('loc.coordinates').near({center:[params.lng, params.lat], maxDistance:(params.radius / 111.12), spheriacal:true}).select(params.fields).skip(params.offset).limit(params.limit).populate('users', {"library":1, _id:0}, 'UserModel').exec(function(err, data) {
                if(err){
                    res.send(err);
                }
                
                res.send(data);
            });
        } else {
            var re = new RegExp(RegExp.escape(params.query), 'i');
            Book.find({$or:[{title:re}, {author:re}], num_users:{$gt:0}}).select(params.fields).skip(params.offset || 0).limit(params.limit).populate('users', {"library":1, _id:0}, 'UserModel').exec(function(err, data) {
                if(err){
                    res.send(err);
                }
                
                res.send(data);
            });
        }
    });
};