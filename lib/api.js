// API
var http = require('http');
var valid = require('./validate');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5');

module.exports = function(err, db, req, res) {
	var auth = !err;
	var path = req.path.split('/');
	if(path[0] == "") path.shift();
	path.shift();
	path.shift();

	if(path[0] == 'books') {
		books(db, req, res, path, auth);
	}
	else if(path[0] == 'library') {
		library(db, req, res, path, auth);
	}
	else if(path[0] == 'users') {
		users(db, req, res, path, auth);
	}
	else if(path[0] == 'messages') {
		messages(db, req, res, path, auth);
	}
	else if(path[0] == 'tel') {
		tel(req, res, path, auth);
	}
	else {
		res.status(400).send();
	}
};

var books = function(db, req, res, path, auth) {
	path.shift();
	if(req.method == 'GET') { // READ
		if(path[0] == 'count') {
			db.books.count(function(err, data) {
				console.log("knih: " + data);
				if(!err && data) {
					res.send(data.toString());
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(path[0]) {
			db.books.readById(path[0], function(err, data) {
				if(!err && data) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else {
			db.books.read(req.query.fields, req.query.q, req.query.limit, req.query.offset, req.query.lat, req.query.lng, req.query.radius, function(err, data) {
				if(!err && data) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
	}
	if(auth) {
		if(req.method == 'POST') { // CREATE
			//db.books.remove(user, data, callback);
		}
		else if(req.method == 'PUT') { // UPDATE
			//db.books.query(callback);
		}
		else if(req.method == 'DELETE') {  // DELETE
			//db.books.querymy(user, callback);
		}
	}
};
var library = function(db, req, res, path, auth) {
	path.shift();
	if(auth) {
		if(req.method == 'GET') { // READ
			db.library.read(req.query.id || req.cookies.id, function (err, data) {
				if(!err && data) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'POST') { // CREATE
			db.library.create(req.body.id || req.cookies.id, req.body.book, function (err, data) {
				if(!err && data) {
					res.send(data);
				} 
				else {
					console.log(err + " " + data);
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'PUT') { // UPDATE
				db.library.update(req.body.id || req.cookies.id, req.body.book, req.body.actions, function (err) {
					if(!err) {
						res.send('OK');
					} 
					else {
						res.status(404).send();
					}
				});

		}
		else if(req.method == 'DELETE') {  // DELETE
			db.library.del(req.query.id || req.cookies.id, req.query.book, function (err) {
				if(!err) {
					res.send('OK');
				} 
				else {
					res.status(404).send();
				}
			});

		}
	}
};
var users = function(db, req, res, path, auth) {
	path.shift();
	// PASSWORD RECOVERY
	if(req.method == 'PUT') {
		if(req.body.action == 'recover') {
			if(req.body.email) {
				valid.email(req.body.email, function(err, email) {
					if(!err && email) {
						db.users.passwordRecovery(email, function(err, data) {
							console.log(err + " " + data);
							if(!err && data) {
								if(data.language && data.language == 'cz') {
									mg.sendText('recovery@bibliofair.com', [email],
										'Obnova hesla',
										['Dobrý den ' + data.username + '!\n',
										'Bylo požádáno o obnovu hesla k Vašemu účtu.',
										'Z důvodu bezpečnosti jsme pro Vás vygenerovali nové heslo.',
										'Doporučujeme změnu vygenerovaného hesla při Vašem příštím přihlášení.',
										'Nové heslo: ' + data.password,
										'www.bibliofair.com' + '\n',
										'S pozdravem, \nTým BiblioFair'].join('\n'),
										'bibliofair.com', {},
										function(err) {
											if (err) console.log('Oh noes: ' + err);
											else     console.log('Message sent to: ' + email);
										});
								}
								else {
									mg.sendText('recovery@bibliofair.com', [email],
										'Password recovery',
										['Hello ' + data.username + '!\n',
										'Password recovery for your user account has been requested.',
										'We have generated new password for you.',
										'We recommend changing it in the accoount settings as soon as you sign in.',
										'New password: ' + data.password,
										'www.bibliofair.com' + '\n',
										'Best regards, \nBiblioFair Team'].join('\n'),
										'bibliofair.com', {},
										function(err) {
											if (err) console.log('Oh noes: ' + err);
											else     console.log('Message sent to: ' + email);
										});
								}
								res.send('OK');
							}
							else {
								console.log('err1');
								res.status(404).send();
							}
						});
					}
					else {
						console.log('err2');
						res.status(404).send();
					}
				});
			}
		}
		else if(!auth && req.body.action == 'lang') {
			console.log('lang_set' + req.body.lang)
			if(req.body.lang == 'en' || req.body.lang == 'cz') {
				console.log('set');
				res.cookie('lang', req.body.lang, { maxAge: 18000000000, httpOnly: true });
				res.send();
			}
		}
	}
	// AUTHORIZED actions
	if(auth) {
		if(req.method == 'GET') { // READ
			db.users.read(req.query.id || req.cookies.id, function (err, data) {
				if(!err && data) {
					res.send(data);
				} 
				else {
					res.status(404).send();
				}
			});
		}
		else if(req.method == 'POST') { // CREATE
		//	db.users.create(user, data, callback);
		}
		// ACCOUNT CHANGES
		else if(req.method == 'PUT') {
				db.users.update(req.body.id || req.cookies.id, req.body, function(err, data){
					if(!err && data) {
						if(req.body.action == 'lang') {
							res.cookie('lang', req.body.lang, { maxAge: 18000000000, httpOnly: true });
						}
						res.send('OK');
					} 
					else {
						res.status(404).send();
					}
				});

		}
		else if(req.method == 'DELETE') {  // Log out user
			db.users.logout(req.body.id || req.cookies.id, function(err, data) {
				if(!err) {
					res.send('OK');
				} 
				else {
					res.status(404).send();
				}
			});
		}
	}
};
var messages = function(db, req, res, path, auth) {
	path.shift();
	if(req.method == 'POST') {
		console.log('message');
		console.log(req.body.subject);
		if(req.body.recipient && req.body.sender) {
			var user = req.body.recipient.split('@')[0];
			console.log(user);
			db.users.findMailByUsername(user.toLowerCase(), function(err, data) {
				if(!err && data) {
					console.log(err + " " + data);
					var mailTo = data.email;
					if(data.language) var language = data.language;
					db.users.findUsernameByMail(req.body.sender.toLowerCase(), function(err, data) {
						if( !err && data && ( mailTo != req.body.sender.toLowerCase() ) ) {
							var mailFrom = data.username + '@bibliofair.com';
							console.log('From: ' + mailFrom + typeof mailFrom);
							console.log('To: ' + mailTo + typeof mailTo);
							console.log('Text: ' + req.param('body-plain'));
							if(language && language == 'cz') {
								mg.sendText(mailFrom, [mailTo],
									req.body.subject,
									[req.param('body-plain'),
									'\n--------------------------------------',
									'Tento email byl odeslán přes službu BiblioFair.',
									'Vaše emailová adresa zůstává ostatním uživatelům skryta.',
									'Zprávy jsou odesílány na adresu ' + req.body.recipient + ', odkud jsou přesměrovány na Vaši soukromou emailovou adresu.',
									'Pro úspěšné doručení odpovědi a nahrazení Vaší soukromé emailové adresy za veřejnou je nutné, abyste odpověď odeslali z Vámi registrované emailové adresy.'].join('\n'),
									'bibliofair.com', {},
									function(err) {
									if (err) console.log('!!!!!!!!!!!!!!!!!!!Oh noes: ' + err);
									else     console.log('Message sent');
									});
							}
							else {
								mg.sendText(mailFrom, [mailTo],
									req.body.subject,
									[req.param('body-plain'),
									'\n--------------------------------------',
									'This email has been sent through BiblioFair.',
									'Your private email address remains hidden at all times.',
									'Messages are sent to ' + req.body.recipient + ' and then redirected to your private email address.',
									'For successful delivery of your messages and to conceal your private email address, it is necessary that all replies are sent from your registered email address.'].join('\n'),
									'bibliofair.com', {},
									function(err) {
									if (err) console.log('!!!!!!!!!!!!!!!!!!!Oh noes: ' + err);
									else     console.log('Message sent');
									});
							}
							res.send('OK');
						}
						else {
							console.log('Err searching for sender');
							res.send('Err');
						}
					});
				}
				else {
					console.log('Err searching for recipient');
					res.send('Err');
				}
			});
		}
	}
};
var tel = function (req, res, path, auth) {
	path.shift();
	if(auth && req.query.q) {
		var options = require('url').parse('http://data.theeuropeanlibrary.org/opensearch/json?query=' + req.query.q + '&apikey=ev3fbloutqdhrqe3pidpal4bav');
		options.rejectUnauthorized = false;
		var all_data = "";
		http.get(options, function (response) {
				response.on('data', function(data) {
					all_data += data;
					});
				response.on('end', function() {
					res.send(all_data);
					});
				response.on('error', function(e) {
					console.log(e);
					});
				});
	}
}
