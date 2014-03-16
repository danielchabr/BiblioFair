'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
	root: rootPath,
	port: process.env.PORT || 8080,
    templateEngine: 'swig',
	messages:{
		mailgun:{
			key: 'key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5',
			server: 'bibliofair.com'
		},
		reportBookEmail: 'Tadeas Petak <tadeaspetak@gmail.com>'
	}
};
