'use strict';

var path = require('path'),
		fs = require('fs'),
		publicPath = path.resolve(__dirname + '/../public');

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
	 * General routes.
	 */

	app.all("*", function(req, res) {
		res.render('index', {
			user: req.user ? JSON.stringify(req.user) : 'null'
		});
	});

	/*app.use(function(req, res, next) {
	 if(req.path.slice(0, 3) == '/en' || req.path.slice(0, 3) == '/cz'){
	 req.url = req.url.slice(3);
	 }
	 next();
	 });*/
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
	/*app.get('/', function(req, res) {
	 res.sendfile(public_path + '/index.html');
	 });*/
	/*app.all('/api/v1/*', function(req, res) {
	 res.set('Cache-Control', 'private, max-age=0, no-cache');
	 auth(db, req, res, api);
	 });
	 app.all("/user", function(req, res, next) {
	 res.set('Cache-Control', 'private, max-age=0, no-cache');
	 auth(db, req, res, function(err, db, req, res) {
	 if(err){
	 if(req.path == '/user'){
	 if(req.cookies.lang){
	 res.status(401).send({lang: req.cookies.lang}); // not sending of 401 is good for testing public API
	 } else{
	 if(req.acceptedLanguages.indexOf('cs') > -1 || req.acceptedLanguages.indexOf('cs-cz') > -1){
	 res.cookie('lang', 'cz', {maxAge: 18000000000, httpOnly: true});
	 res.status(401).send({lang: 'cz'});
	 } else{
	 res.cookie('lang', 'en', {maxAge: 18000000000, httpOnly: true});
	 res.status(401).send({lang: 'en'});
	 }
	 }
	 }
	 } else{
	 if(req.path == '/user'){
	 res.send({id: req.cookies.id, token: req.cookies.token, lang: req.cookies.lang});
	 }
	 }
	 })
	 });*/
	/*app.use(function(req, res, err) {
	 res.status(404).sendfile(public_path + '/index.html');
	 });*/
};

