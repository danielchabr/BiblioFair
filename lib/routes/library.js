'use strict';

var library = require("../api/library"),
        authorization = require('./middlewares/authorization.js'),
        errors = require("../helpers/errors");

module.exports = function(app) {

    /**
     * Expose private API.
     */
    
    app.get("/api/library", authorization.login, function(req, res) {
        library.read(req.user._id, function(err, data) {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.send(data);
            }
        });
    });

    app.post("/api/library", authorization.login, function(req, res) {
        library.add(req.user._id, req.body, function(err, data) {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.send(data);
            }
        });
    });

    app.put("/api/library/:book", authorization.login, function(req, res) {
        library.update(req.user._id, req.params.book, req.body, function(err, data) {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.send(data);
            }
        });
    });

    app.delete("/api/library/:book", authorization.login, function(req, res) {
        library.remove(req.user._id, req.params.book, function(err, data) {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.send(data);
            }
        });
    });

};