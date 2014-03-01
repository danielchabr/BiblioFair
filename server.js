'use strict';
var express = require('express');
var fs = require('fs');
var router = require('./lib/router');

// bootstrap models (walk through the models (all the *.js and *.coffee files) in the /lib/models directory)
var modelsPath = __dirname + '/lib/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(modelsPath);

var db = require('./lib/db');

var app = express();
//to be moved into some "express config" file
app.use(express.bodyParser());
db.connect();

try {
    // bootstrap routes (walk through the APIs (all the *.js and *.coffee files) in the /lib/api directory)
    var routesPath = __dirname + '/lib/api';
    var walk = function(path) {
        fs.readdirSync(path).forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath)(app);
                }
                //skip the middlewares directory
            } else if (stat.isDirectory() && file !== 'middlewares') {
                walk(newPath);
            }
        });
    };
    walk(routesPath);
    
    router(app, db);
} catch (e) {
    console.log("Router error: ");
    console.log(e);
    console.log(e.stack);
}

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || 8080;
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost';

try {
    app.listen(port, ipaddr);
} catch (e) {
    console.log("App.listen error: ");
    console.log(e);
    console.log(e.stack);
}

/*
 */

