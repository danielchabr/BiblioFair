angular.module('mainapp', ['ui.bootstrap', 'pascalprecht.translate'])

.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide', '$translateProvider', function($routeProvider, $locationProvider, $httpProvider, $provide, $translateProvider) {
	$routeProvider
	.when('/', {templateUrl: '/partials/home.html',   controller: homeControl})
	.when('/login', {templateUrl: '/partials/welcome.html',   controller: loginControl})
	.when('/library', {templateUrl: '/partials/library.html',   controller: libraryControl})
	.when('/account', {templateUrl: '/partials/account.html',   controller: accountControl})
	.otherwise({redirectTo: '/'});
	$locationProvider.html5Mode(true).hashPrefix('!');
	$provide.factory('myHttpInterceptor', function($q, $location, $rootScope) {
		return {
			'response': function(response) {
				return response || $q.when(response);
			},
			'responseError': function(rejection) {
				var status = rejection.status;
				if (status == 401) {
					$rootScope.redirect = $location.url(); // save the current url so we can redirect the user back
					$location.path('/login');
				}
				return $q.reject(rejection);
			}
		};
	});
	$httpProvider.interceptors.push('myHttpInterceptor');
	$translateProvider.translations('en', {
		'NAV': { 'BROWSE': 'Browse',
				'LIBRARY': 'My Library',
				'ACCOUNT': 'Account',
				'SIGN_OUT': 'Sign out',
				'LANGUAGE': 'Language',
				'ENGLISH': 'English',
				'CZECH': 'Czech',
				'SEARCH': { 'BUTTON':'Search',
							'PLACEHOLDER': 'Title, author, ISBN, ...'}},
		'WELCOME': { 'HEADING': 'Dive into the world of home libraries',
					'TEXT1': 'Our aim is to enable you to share your home bookshelves. You will get requests from your friends or others to sell, rent or lend them books from your home library.',
					'TEXT2': 'Would you like to read a book that is otherwise too expensive or hard to get? Just sign up and easily search our databases. If you can\'t find what you\'re looking for, just put it on your wish list and we will notify you as soon as the book gets available.',
					'EMAIL': 'Email',
					'PASSWORD': 'Password',
					'JOIN': 'Join',
					'SIGNIN': 'Sign in',
					'REGISTER_TEXT': 'Register for a free account',
					'SIGNIN_TEXT': 'Sign in',
					'AGAIN': 'Email or password is incorrect. Please try again',
					'SHORT_PASSWORD': 'Password needs to be at least 6 characters long',
					'VERIFICATION_SENT': 'Verification email has been sent to ',
					'EXISTS': 'Email already registered'},
		'HOME': { 'ORDER': { 'TEXT': 'Order by:',
							'TITLE': 'Title',
							'AUTHOR': 'Author'}},
		'LIBRARY': { 'ADD': { 'HEADING': 'Add books to your library',
							'TEXT': 'We recommend first filling in ISBN, the rest might get filled in automatically from our databases',
							'ISBN': 'ISBN',
							'TITLE': 'Title',
							'AUTHOR': 'Author',
							'OPTIONAL': 'View optional fields',
							'SUBTITLE': 'Subtitle',
							'EDITION': 'Edition',
							'VOLUME': 'Volume',
							'PUBLISHED': 'Published on',
							'PUBLISHER': 'Publisher',
							'LANGUAGE': 'Language',
							'BUTTON': 'Add book'}},
		'ACCOUNT': { 'LONGITUDE': 'Longitude',
					'LATITUDE': 'Latitude',
					'SAVE': 'Save',
					'SAVING': 'Saving ...',
					'SAVED': 'Saved'},
		'DETAIL': { 'BY': 'By',
					'CLOSE': 'Close',
					'REMOVE': 'Remove'}
	});
	$translateProvider.translations('cz', {
		'NAV': { 'BROWSE': 'Procházet',
				'LIBRARY': 'Moje knihovna',
				'ACCOUNT': 'Účet',
				'SIGN_OUT': 'Odhlásit',
				'LANGUAGE': 'Jazyk',
				'ENGLISH': 'Anglicky',
				'CZECH': 'Česky',
				'SEARCH': { 'BUTTON':'Hledat',
							'PLACEHOLDER': 'Titul, autor, ISBN, ...'}},
		'WELCOME': { 'HEADING': 'Ponořte se do světa domácích knihoven',
					'TEXT1': 'Naším cílem je umožnit Vám přeměnit vaši poličky s knihami v knihovnu nebo knihkupectví. Budete dostávat žádosti o koupi, pronájem nebo půjčení Vašich knih. Jen Vy rozhodujete o tom, které knihy a jak pošlete dále do světa.',
					'TEXT2': 'Rádi byste si přečetli knihu, která je ke koupi příliš drahá a v knihovnách neustále rozebraná? Chcete ušetřit a koupit raději knihu z druhé ruky? Během chvilky si u nás můžete zdarma vytvořit účet a zjistit, jestli Vaše požadovaná kniha není v domácí knihovně někoho v okolí. Pokud knihu náhodou nenajdete, můžete vložit na svůj seznam přání a my Vás budeme informovat hned, jakmile bude dostupná.',
					'EMAIL': 'Email',
					'PASSWORD': 'Heslo',
					'JOIN': 'Registrovat',
					'SIGNIN': 'Přihlásit',
					'REGISTER_TEXT': 'Registrovat',
					'SIGNIN_TEXT': 'Přihlásit se',
					'AGAIN': 'Chybný email nebo heslo, prosím zkusto to znovu',
					'SHORT_PASSWORD': 'Heslo musí mít alespoň 6 znaků',
					'VERIFICATION_SENT': 'Ověřovací email byl zaslán na adresu ',
					'EXISTS': 'Účet pro tento email již existuje'},
		'HOME': { 'ORDER': { 'TEXT': 'Seřadit podle:',
							'TITLE': 'Titul',
							'AUTHOR': 'Autor'}},
		'LIBRARY': { 'ADD': { 'HEADING': 'Vložte knihy do své knihovny: ',
							'TEXT': 'Doporučujeme začít vyplněním pole ISBN, další údaje se možná vyplní automaticky z naší databáze',
							'ISBN': 'ISBN',
							'TITLE': 'Titul',
							'AUTHOR': 'Autor',
							'OPTIONAL': 'Zobrazit volitelná pole',
							'SUBTITLE': 'Podtitul',
							'EDITION': 'Vydání',
							'VOLUME': 'Díl',
							'PUBLISHED': 'Vydáno roku',
							'PUBLISHER': 'Vydavatel',
							'LANGUAGE': 'Jazyk',
							'BUTTON': 'Vlož knihu'}},
		'ACCOUNT': { 'LONGITUDE': 'Zeměpisná délka',
					'LATITUDE': 'Zeměpisná šířka',
					'SAVE': 'Ulož',
					'SAVING': 'Ukládám ...',
					'SAVED': 'Uloženo'},
		'DETAIL': { 'BY': 'od',
					'CLOSE': 'Zavřít',
					'REMOVE': 'Smazat'}
	});
	$translateProvider.preferredLanguage('cz');
}])
.run(function ($rootScope, $http, $location, $translate) {
	$rootScope.user = "";
	$rootScope.books = [];
	$rootScope.mybooks = [];

	$http.get('/user')
	.success(function (data) {
		$rootScope.user = data;
	})
	.error(function (data) {
		$location.path('/login');
	});

	$rootScope.logout = function () {
		$rootScope.user = {}
		$http.post('/logout', {});
		//clearListCookies();
		$location.path('/login');
	}
	$rootScope.collapse = function () {
		$rootScope.isCollapsed = $('.navbar-toggle').css("display") == 'none';
	};
	window.onresize = function () {$rootScope.collapse();$rootScope.$apply();};
	$rootScope.changeLanguage = function (langKey) {
		$translate.uses(langKey);
	};
});
