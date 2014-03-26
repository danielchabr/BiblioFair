'use strict';

var path = require('path'),
		fs = require('fs'),
		config = require('../config/config'),
		publicPath = path.resolve(__dirname + '/../public'),
		messaging = require('./helpers/messaging');

module.exports = function(app) {

	/**
	 * All the files in the '/public' directory should be just served.
	 */

	fs.readdirSync(publicPath).forEach(function(file) {
		var filePath = publicPath + '/' + file;
		if(fs.statSync(filePath).isFile()){
			app.get('/' + file, function(req, res) {
				res.sendfile(filePath);
			});
		}
	});
	
	/**
	 * Language routes.
	 * 
	 * Take routes such as '/en', '/en/home', '/cs/library' etc., save the language
	 * and redirect to the appropriate url ('/', '/home', '/library').
	 */
	
	config.languages.forEach(function(language){
		app.all("/" + language + "/?*?",function(req, res){
			res.setLanguage(language);
			res.redirect(req.path.slice(language.length + 1));
		});
	});

	/**
	 * General routes.
	 */

	app.all("*", function(req, res) {
		//language
		res.setLanguage(req.getLanguage());
		
		//add translations
		var translations = {};
		for(var lang in messaging.messages){
			translations[lang] = {};
			translations[lang]['errors'] = messaging.messages[lang].errors;
		}
		
		//render
		res.render('index', {
			user: req.user ? JSON.stringify(req.user) : 'null',
			errors: messaging.normalizeError(req.flash('error'), req.getLanguage()),
			infos: messaging.normalizeInfo(req.flash('info'), req.getLanguage()),
			translations: JSON.stringify(translations)
		});
	});

/////////////  PUBLIC PART
	/*app.get('*', function(req, res, next) {
	 if(req.url.indexOf('?_escaped_fragment_=') != -1){
	 console.log("google bot" + new Date());
	 if(req.url.indexOf('cz') > -1){
	 res.sendfile(public_path + "/snapshot_cz.html");
	 } else{
	 res.sendfile(public_path + "/snapshot_en.html");
	 }
	 }
	 else
	 next();
	 });
	 app.get('*', function(req, res, next) {
	 if(/^blog./.test(req.headers.host)){  //if it's a sub-domain
	 console.log("blog" + new Date());
	 if(req.path == '/'){
	 res.sendfile(public_path + '/blog' + '/index.html');
	 } else{
	 fs.stat(public_path + '/blog' + req.path, function(err, stats) {
	 if(err || !stats.isFile())
	 next();
	 else
	 res.sendfile(public_path + '/blog' + req.path);
	 });
	 }
	 }
	 else
	 next();
	 });*/
	/*app.get("/partials/private/*", function(req, res, next) {
	 auth(db, req, res, function(err, db, req, res) {
	 if (err) {
	 res.status(401).sendfile(public_path + '/index.html');
	 }
	 else {
	 next();
	 }
	 });
	 });*/
};

