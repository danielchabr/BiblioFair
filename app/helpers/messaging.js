var messages = exports.messages = {
	cs: {
		emails: {
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
			_explanation: '\n--------------------------------------\n' +
				'Tento email byl odeslán přes službu BiblioFair.\n' +
				'Vaše emailová adresa zůstává ostatním uživatelům skryta.\n' +
				'Zprávy jsou odesílány na adresu {recipient}, odkud jsou přesměrovány na Vaši soukromou emailovou adresu.\n' +
				'Pro úspěšné doručení odpovědi a nahrazení Vaší soukromé emailové adresy za veřejnou je nutné, abyste odpověď odeslali z Vámi registrované emailové adresy.\n',
		},
		errors: {
			username: {
				invalid: "Neplatné uživatelské jméno.",
				required: "Uživatelské jméno je povinné.",
				exists: "Toto uživatelské jméno již existuje. Zvolte si prosím jiné."
			},
			email: {
				invalid: "Neplatná e-mailová adresa.",
				required: "E-mail je povinný.",
				exists: "Tato e-mailová adresa je již registrovaná."
			},
			password: {
				required: "Zvolte si prosím heslo.",
				short: "Heslo musí být nejméně 6 znaků dlouhé.",
				incorrect: "Špatné heslo."
			},
			user: {
				notFound: "Uživatel nenalezen.",
				notVerified: "Vaš e-mail nebyl potvrzen.",
				notLocated: "Nastavte prosím svou polohu.",
				notAuthenticated: "Uživatel není přihlášen."
			},
			//for the recipients when transferring books etc.
			toUser: {
				notFound: "Příjemce knihy nenalezen.",
				notLocated: "Příjemce nemá nastevnou polohu, tudíž knihu nelze převést.",
				notVerified: "Příjemce nemá potvrzenou e-mailovou adresu, tudíž knihu nelze převést.",
				cannotTransferToSelf: "Převádět knihu na sebe samého (či sebe samou) nedává smysl! :)"
			},	
			book: {
				notFound: 'Kniha nenalezena.'
			},
			facebook: {
				userDenied: "Přihlášení se nezdařilo, protože jste odmítli sdílet s námi informace.",
				error: "Přihlášení se nezdařilo."
			},
			google: {
				accessDenied: "Přihlášení se nezdařilo.",
				error: "Přihlášení se nezdařilo."
			},
			actions: {
				required: 'Je třeba zvolit alespoň jednu akci'
			},
			messaging: {
				fromEqualsTo: "Odesílatel a adresát emailu jsou stejní"
			}
		},
		info: {
			user: {
				verified: "E-mail byl úspěšně ověřen."
			}
		},
		texts: {
		}
	},
	en: {
		/**
		 * Emails.
		 */
		emails: {
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
			_explanation: '\n--------------------------------------\n' +
				'This email has been sent through BiblioFair.\n' +
				'Your private email address remains hidden at all times.\n' +
				'Messages are sent to {recipient} and then redirected to your private email address.\n' +
				'For successful delivery of your messages and to conceal your private email address, it is necessary that all replies are sent from your registered email address.\n'
		},
		/**
		 * Errors.
		 */
		errors: {
			username: {
				invalid: "Invalid username.",
				required: "Username is required.",
				exists: "This username exists."
			},
			email: {
				invalid: "Invalid e-mail.",
				required: "E-mail is required.",
				exists: "This e-mail is already registered."
			},
			password: {
				required: "Passoword is required.",
				short: "Password has to be at least 6 characters long.",
				incorrect: "Incorrect password.",
				notMatched: "Passwords do not match."
			},
			user: {
				notFound: "User not found.",
				notVerified: "Your e-mail address has not been verified.",
				notLocated: "You have not set your location yet.",
				notAuthenticated: "User is not authenticated."
			},
			toUser: {
				notFound: "The recipient was not found.",
				notLocated: "The recipient has not set his/her location yet.",
				notVerified: "The recipient has not verified his/her account yet.",
				cannotTransferToSelf: "There is no logic in transferring the book to yourself! :)"
			},	
			book: {
				notFound: 'Book not found.'
			},
			author: {
				required: 'Author is required.'
			},
			title: {
				required: 'Title is required.'
			},
			published: {
				invalid: 'Invalid year of publishment.'
			},
			facebook: {
				userDenied: "Login failed as you denied our access to your information.",
				error: "Login failed."
			},
			google: {
				accessDenied: "Login failed.",
				error: "Login failed."
			},
			actions: {
				required: 'At least one action must be checked'
			},
			messaging: {
				fromEqualsTo: "Sender and recipient of email are the same"
			}
		},
		/**
		 * Info & notifications.
		 */
		info: {
			user: {
				verified: "E-mail verified."
			}
		},
		/**
		 * Texts for the frontend part.
		 */
		texts: {
			title: 'BiblioFair | Book trading, exchanging and swapping made easier',
			description: 'Share your books and get requests from your friends or others to sell, lend or borrow them the wished books or textbooks. Enter the world of book trading',
			general: {
				email: 'E-mail',
				username: 'Username',
				emailOrUsername: 'Username or e-mail',
				password: 'Password',
				next: 'Next',
				prev: 'Previous',
				by: 'By',
				close: 'Close',
				saveAndClose: 'Save and Close',
				remove: 'Remove',
				search: 'Search',
				notFound: 'Not found',
				changing: 'Changing...',
				saving: 'Saving...',
				title: 'Title',
				author: 'Author',
				isbn: 'ISBN',
				actions: 'Actions',
				sell: 'Sell',
				donate: 'Donate',
				lend: 'Lend',
				sells: 'Sells',
				donates: 'Donates',
				lends: 'Lends',
				subtitle: 'Subtitle',
				edition: 'Edition',
				volume: 'Volume',
				publishedOn: 'Published on',
				publisher: 'Publisher',
				language: 'Language',
				note: 'Note'
			},
			header: {
				browse: 'Browse',
				library: 'My Library',
				messages: 'Messages',
				account: 'Account',
				signOut: 'Sign out',
				signIn: 'Sign in',
				language: 'Language',
				english: 'English',
				czech: 'Česky'
			},
			search: {
				heading: 'Try checking out your favorite book ...',
				button: 'Search',
				placeholder: 'Title, author, ISBN, ...',
				notFound: 'No one has added this book yet. You can be the first one'
			},
			welcome: {
				heading: 'Dive into the world of home libraries',
				heading2: 'Let\'s get the books flowing',
				text1: 'We will enable you to turn your home bookshelf into a private library or bookshop. You will get requests from your friends or others, asking you to sell, rent or lend them books from your home library. Only you decide which books you send out into the world.',
				text2: 'Would you like to read a book that is otherwise too expensive or hard to get in a library? Do you want to save money and the environment by getting a second hand book? Just sign up and search our databases easily.',
				process: {
					heading: 'How it works',
					reader: 'For readers',
					owner: 'For book owners',
					choose: 'Choose a book',
					send: 'Send a request',
					addBooks: 'Add your books',
					receive: 'Receive requests',
					meet: 'Arrange your book exchange'
				},
				join: 'Join',
				registerText: 'Account is Completely Free',
				register: 'Register',
				registerAction: 'Join us',
				registerActionSmall: 'Join us today',
				verificationSent: 'Verification email has been sent to ',
				booksAvailable: 'books available',
				registrationRequired: 'Please register for possibility of requesting books',
				usernameSuggested: 'Just a suggestion. Feel free to change it to whatever suits you.'
			},
			recovery: {
				heading: 'Password recovery',
				email: 'Account email address',
				send: 'Send',
				sent: 'Newly generated password has benn sent to your email address'
			},
			home: {
				order: {
					text: 'Order by:',
					title: 'Title',
					author: 'Author',
					distance: 'Distance',
					selling: 'Selling',
					donating: 'Donating',
					lending: 'Lending'
				},
				modal: {
					request: 'Send request',
					requestSent: 'Request was sent',
					report: 'Report this book',
					owners: 'Owners',
					showNote: 'Show note'
				},
				wishList: 'Wish list',
				browse: 'Available books'
			},
			account: {
				setLocation: 'Set your location by centering the map',
				searchLocation: 'Search by address',
				searchLocationText: 'E.g. 96 Euston Road, London',
				notFound: 'We could not find this address, please try different one or set map manually',
				saveLocation: 'Save location',
				locationSaved: 'Location saved',
				change: {
					header: 'Change password',
					passwordNew: 'New password',
					passwordOld: 'Old password',
					passwordAgain: 'New password again',
					change: 'Change password',
					changed: 'Password changed',
					error: 'Password not changed'
				}
			},
			library: {
				add: {
					heading: 'Add book',
					text: 'We recommend first filling in ISBN, the rest might get filled in automatically from our databases',
					isbnAbbr: 'International Standard Book Number can usually be found above bar code at the back side of the book',
					optional: 'View optional fields',
					note: 'Price, physical condition, etc.',
					button: 'Add book'
				},
				notLocated: {
					text: 'To add books, please set your location in your ',
					link: ' account settings'
				},
				notVerified: 'To add books, please verify your account. Just click the link in the e-mail you received right after the registration.'
			}
		}
	}
};
/**
 * Normalizes and translates given objects into a human readable form.
 * 
 * @param {type} error Received e
 * @param {type} language
 * @returns {object} Initial error or normalized errors.
 */

exports.normalizeError = function(error, language) {
	return Message.normalize(Message.ERROR, error, language);
};
exports.normalizeInfo = function(info, language) {
	return Message.normalize(Message.INFO, info, language);
};
var Message = {
	ERROR: 'errors',
	INFO: 'info',
	normalize: function(type, obj, language) {
		//return undefined if empty
		if(obj === undefined || (obj instanceof Array && !obj.length)){
			return;
		}

		var self = this;
		//type
		this.type = type;
		//init result object
		this.normalized = [];
		//normalize
		this._normalize(obj);
		//translate the objects (where applicable)
		this.normalized.forEach(function(o) {
			if(o.path && o.type){
				try {
					var message = messages[language][self.type][o.path][o.type];
					if(message){
						o.message = message;
						o.normalized = true;
					}
				} catch (e) {
				}
			}
		});
		return this.normalized;
	},
	/**
	 * Main function.
	 * 
	 * @param {type} objects
	 * @returns {undefined}
	 */

	_normalize: function(obj) {
		var self = this;
		//array of objects
		if(obj instanceof Array){
			obj.forEach(function(object) {
				self._normalize(object);
			});
		}
		//a single object (error, info, string etc.)
		else{
			if(this.type === Message.ERROR){
				this.normalizeError(obj);
			}
			else if(this.type === Message.INFO){
				this.normalizeInfo(obj);
			}
		}
	},
	/**
	 * Normalize a single info object.
	 * 
	 * @param {object || string} info
	 * @returns {undefined}
	 */

	normalizeInfo: function(info) {
		//string
		if(typeof (info) === "string"){
			this.normalizeString(info);
		}
		else{
			this.add(info);
		}
	},
	/**
	 * Normalize a single error.
	 * 
	 * @param {object || string} error
	 * @returns {undefined}
	 */

	normalizeError: function(error) {
		//string
		if(typeof (error) === "string"){
			this.normalizeString(error);
		}
		//Mongoose validation errors
		else if(error.name === "ValidationError"){
			this.normalizeValidationError(error);
		}
		//errors created by calling e.g. new Error('user.notFound')...
		else if(error.message){
			this.normalizeString(error.message);
		}
		else{
			this.add(error);
		}
	},
	/**
	 * Add an error to the result.
	 * 
	 * @param {object} error
	 * @returns {undefined}
	 */
	add: function(error, original) {
		error.original = original;
		this.normalized.push(error);
	},
	/**
	 * Helper method.
	 * Normalize a string error.
	 * 
	 * @param {type} string
	 * @returns {undefined}
	 */

	normalizeString: function(string) {
		var e = string.split(".");
		this.add({
			path: e[0],
			type: e[1]
		}, e);
	},
	/**
	 * Helper method.
	 * Normalize a validation error (Mongoose specific).
	 * 
	 * @param {type} error
	 * @returns {undefined}
	 */

	normalizeValidationError: function(error) {
		var self = this;
		//loop through the individual errors
		Object.keys(error.errors).forEach(function(key) {
			var e = error.errors[key];
			//'user exists', 'email invalid' etc. (custom validators)
			if(e.type === "user defined"){
				self.add({
					path: e.path,
					type: e.message
				}, e);
			}
			//'username' required etc. (Mongoose built-in validators)
			else{
				self.add({
					path: e.path,
					type: e.type
				}, e);
			}
		});
	}
};
