'use strict';

var express = require('express'),
        fs = require('fs'),
        passport = require('passport'),
        mongoose = require('mongoose');

// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize system variables 
var config = require('./config/config');

// Bootstrap models (walk and require all the models (all the *.js and *.coffee files) in the /app/models directory)
var modelsPath = __dirname + '/app/models';
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

// Connect to the database
mongoose.connection.on('connected', function() {
    if (process.env.NODE_ENV === "production") {
        console.log('DB connected;\nHost: ' + process.env.OPENSHIFT_MONGODB_DB_HOST + '\nPort: ' + process.env.OPENSHIFT_MONGODB_DB_PORT);
    }
});
mongoose.connection.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    mongoose.connect(config.database);
});
mongoose.connection.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
mongoose.connect(config.database);

// passport config
require('./config/passport')(passport);

// Express app init and configuration
var app = express();
require('./config/express')(app, passport);

try {
    // Bootstrap API routes (walk and require all the APIs (all the *.js and *.coffee files) in the /app/api directory)
    var apisPath = __dirname + '/app/routes';
    var walk = function(path) {
        fs.readdirSync(path).forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js$|coffee$)/.test(file)) {
                    require(newPath)(app, passport);
                }
                //skip the middlewares directory
            } else if (stat.isDirectory() && file !== 'middlewares') {
                walk(newPath);
            }
        });
    };
    walk(apisPath);

    require('./app/router')(app);
} catch (e) {
    console.log("Router error: ");
    console.log(e);
    console.log(e.stack);
}

var port = (process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_INTERNAL_PORT || config.port);
var ipaddr = (process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_INTERNAL_IP || 'localhost');

exports = module.exports = app;
try {
    app.listen(port, ipaddr);
		console.log("App listening on port " + port + ". Environment: " + process.env.NODE_ENV + ".");
} catch (e) {
    console.log("App.listen error: ");
    console.log(e);
    console.log(e.stack);
}

/*
 */

