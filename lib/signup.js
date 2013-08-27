// SIGN UP
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-9q6wmvaf8-8-uyu7n-hd5cwvjqc76jn5');

module.exports = function (app, db) {
	return function (req, res) {
		db.users.exists(req.body.email, function (exists) {
			if(exists) {
				res.send('emailExists');
			}
			else {
				db.users.add(req.body.email, req.body.password, function (err, link) {
					if(!err) {
					mg.sendText('support@bibliofair.com', [req.body.email],
						'Welcome to BiblioFair',
						['Hello, and welcome to BiblioFair!\n',
						'To verify your email address please click the link below:',
						'http://bibliofair.com/verify/'+link,
						'Please do not reply to this message.\n',
						'We hope you will enjoy using our services.\n',
						'Best regards, \nBiblioFair Team'].join('\n'),
						'bibliofair.com', {},
						function(err) {
							if (err) console.log('Oh noes: ' + err);
							else     console.log('Success');
						});
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
