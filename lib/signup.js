// SIGN UP
'use strict';
var Mailgun = require('mailgun').Mailgun;
var valid = require('./validate');
var mg = new Mailgun('key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5');

module.exports = function (app, db) {
	return function (req, res) {
		res.set('Cache-Control', 'private, max-age=0, no-cache');
		db.users.exists(req.body.email, req.body.username, function (err, data) {
			if(err) {
				res.send(data);
			}
			else {
				db.users.add(req.body.username, req.body.email, req.body.password_username, req.body.password_email, req.body.lang, function (err, link) {
					if(!err) {
						if(req.body.lang == 'cz') {
							res.cookie('lang', 'cz', { maxAge: 18000000000, httpOnly: true });
							mg.sendText('support@bibliofair.com', [req.body.email],
								'Vítejte na BiblioFair',
								['Dobrý den ' + req.body.username + '!\n',
								'Pro ověření Vašeho účtu prosím klikněte na následující odkaz:',
								'http://www.bibliofair.com/verify/'+link,
								'Doufáme, že se Vám zalíbí naše služby.\n',
								'S pozdravem, \nTým BiblioFair'].join('\n'),
								'bibliofair.com', {},
								function(err) {
									if (err) console.log('Oh noes: ' + err);
									else     console.log('New user registered');
								});
						}
						else {
							res.cookie('lang', 'en', { maxAge: 18000000000, httpOnly: true });
							mg.sendText('support@bibliofair.com', [req.body.email],
								'Welcome to BiblioFair',
								['Hello ' + req.body.username + ', and welcome to BiblioFair!\n',
								'To verify your email address please click the link below:',
								'http://www.bibliofair.com/verify/'+link,
								'We hope you will enjoy using our services.\n',
								'Best regards, \nBiblioFair Team'].join('\n'),
								'bibliofair.com', {},
								function(err) {
									if (err) console.log('Oh noes: ' + err);
									else     console.log('New user registered');
								});
						}
				res.send('registered');
					}
					else {
						res.send(err);
					}
				}
				);
			}
		});
	};
};
