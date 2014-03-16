module.exports = {
	cz: {
		verification: {
			subject: 'Vítejte na BiblioFair',
			body: 'Dobrý den {username}!\n\n' +
					'Pro ověření Vašeho účtu prosím klikněte na následující odkaz:\n' +
					'http://www.bibliofair.com/verify/{link}\n' +
					'Doufáme, že se Vám zalíbí naše služby.\n\n' +
					'S pozdravem, \n' +
					'Tým BiblioFair'
		},
		recovery: {
			subject: 'Obnova hesla',
			body: 'Dobrý den {username}!\n\n' +
					'Bylo požádáno o obnovu hesla k Vašemu účtu.\n' +
					'Z důvodu bezpečnosti jsme pro Vás vygenerovali nové heslo.\n' +
					'Doporučujeme změnu vygenerovaného hesla při Vašem příštím přihlášení.\n' +
					'Nové heslo: {password}\n' +
					'www.bibliofair.com \n\n' +
					'S pozdravem,\n' +
					'Tým BiblioFair'
		},
		request: {
			subject: 'Žádost o knihu',
			body: 'Dobrý den {to}!\n' +
					'Uživatel {from} by od Vás rád koupil, půjčil nebo jinak získal knihu. Pokud máte zájem, stačí odpovědět na tuto zprávu a domluvit detaily předání přímo s ním.\n' +
					'Informace o požadované knize:\n' +
					'Titul: {book.title}\n' +
					'Autor: {book.author}\n\n' +
					'S pozdravem a přáním hezkého dne,\n' +
					'Tým BiblioFair'
		},
		emailExplanation: '\n--------------------------------------\n' +
				'Tento email byl odeslán přes službu BiblioFair.\n' +
				'Vaše emailová adresa zůstává ostatním uživatelům skryta.\n' +
				'Zprávy jsou odesílány na adresu {recipient}, odkud jsou přesměrovány na Vaši soukromou emailovou adresu.\n' +
				'Pro úspěšné doručení odpovědi a nahrazení Vaší soukromé emailové adresy za veřejnou je nutné, abyste odpověď odeslali z Vámi registrované emailové adresy.\n',
		errors: {
			username: {
				invalid: "Neplatné uživatelské jméno.",
				required: "Uživatelské jméno je povinné.",
				exists: "Toto uživatelské jméno již existuje. Zvolte si prosím jiné."
			},
			email: {
				invalid: "Neplatná e-mailová adresa.",
				required: "E-mail je povinný.",
				exists: "Tato e-mailová adresa je již regostravaná."
			},
			password: {
				required: "Zvolte si prosím heslo.",
				invalid: "Heslo musí být nejméně 6 znaků dlouhé.",
				incorrect: "Špatné heslo."
			},
			user: {
				notFound: "Uživatel nenalezen."
			},
			book: {
				notFound: 'Kniha nenalezena.'
			}
		}
	},
	en: {
		verification: {
			subject: 'Welcome to BiblioFair',
			body: 'Hello {username} and welcome to Bibliofair!\n\n' +
					'To verify your email address please click the link below:\n' +
					'http://www.bibliofair.com/verify/{link}\n' +
					'We hope you will enjoy using our services.\n\n' +
					'Best regards, \n' +
					'BiblioFair Team'
		},
		recovery: {
			subject: 'Password recovery',
			body: 'Hello {username}!\n\n' +
					'Password recovery for your user account has been requested.\n' +
					'We have generated new password for you.\n' +
					'We recommend changing it in the accoount settings as soon as you sign in.\n' +
					'New password:{password}\n' +
					'www.bibliofair.com\n\n' +
					'Best regards,\n' +
					'BiblioFair Team'
		},
		request: {
			subject: 'Book request',
			body: 'Hello {to}!\n' +
					'User {from} would like to buy, borrow or otherwise get a book from you. If you are intereseted reply to this message and arrange details of the deal directly with him.\n' +
					'Details of requested book:\n' +
					'Title: {book.title}\n' +
					'Author: {book.author}\n\n' +
					'Best regards,\n' +
					'BiblioFair team'
		},
		report: {
			subject: 'Book report',
			body: 'Hello!\n' +
					'User {username} reported book\n' +
					'Title: {book.title}\n' +
					'Author: {book.author}\n'
		},
		emailExplanation: '\n--------------------------------------\n' +
				'This email has been sent through BiblioFair.\n' +
				'Your private email address remains hidden at all times.\n' +
				'Messages are sent to {recipient} and then redirected to your private email address.\n' +
				'For successful delivery of your messages and to conceal your private email address, it is necessary that all replies are sent from your registered email address.\n',
		errors: {
			username: {
				invalid: "Invalid username.",
				required: "Username is required.",
				exists: "This username exists."
			},
			email: {
				invalid: "Invalid e-mail.",
				required: "E-mail is required.",
				exists: "This username exists."
			},
			password: {
				required: "Passoword is required.",
				invalid: "The password has to be at least 6 characters long.",
				incorrect: "Incorrect password."
			},
			user: {
				notFound: "User not found."
			},
			book: {
				notFound: 'Book not found.'
			}
		}
	}
};