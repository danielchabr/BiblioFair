var winston = require('winston'),
	config = require('../../config/config');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: config.root + '/public/logs/debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: config.root + '/public/logs/exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;