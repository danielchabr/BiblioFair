'use strict';
// for IE compatibility
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	var msViewportStyle = document.createElement("style");
		msViewportStyle.appendChild(
				document.createTextNode(
					"@-ms-viewport{width:auto!important}"
					)
				);
		document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}

/**
 * TODO get unique books directly from mongo.
 */

var uniqBooks = function (arr, comparator) {
	var arr = arr.sort(comparator);
	var res = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i+1] === undefined || comparator(arr[i], arr[i+1]) !== 0) {
			res.push(arr[i]);
		}
	}
	return res;
};

'use strict';

// create bibliofair module
angular.module('bibliofair', [
	'ngRoute',
	'ngSanitize',
	'ngCookies',
	'ngAnimate',
	'ui.bootstrap',
	'pascalprecht.translate'
]);


angular.module('bibliofair')
	// app init
	.run(['$rootScope', '$translate', '$timeout', 'Global',
		function($rootScope, $translate, $timeout, Global) {
			//user
			$rootScope.user = Global.user();
			$rootScope.authenticated = Global.authenticated();
			//books
			$rootScope.books = [];
			$rootScope.mybooks = [];
			//language
			$rootScope.lang = Global.language();
			$translate.use($rootScope.lang);
			//alerts and infos
			$rootScope.alerts = window.alerts;

			/**
			 * Send GA code every 10 seconds.
			 * 
			 * @param {time elapsed} elapsed
			 * @returns {undefined}
			 */

			var GANotifier = function(elapsed) {
				$timeout(function() {
					elapsed += 10;
					ga('send', 'event', 'time_elapsed', 'time_spent', 'Time elapsed', elapsed);
					GANotifier(elapsed);
				}, 10000);
			};
			GANotifier(0);

			/** TODO sort out */

			$rootScope.collapse = function() {
				$rootScope.isCollapsed = $('.navbar-toggle').css("display") === 'none';
			};
			window.onresize = function() {
				$rootScope.collapse();
				$rootScope.$apply();
			};
		}])
	// global functions
	.run(['$rootScope', '$location', '$modal', 'Global', 'Users',
		function($rootScope, $location, $modal, Global, Users) {

			/**
			 * Return "active" if given path is currently active (used for links classes in menu).
			 * 
			 * @param {string} path
			 * @returns {String}
			 */

			$rootScope.isActive = function(path) {
				return $location.path().substr(0, path.length) === path ? "active" : "";
			};

			/**
			 * Change language.
			 * 
			 * @param {string} lang
			 * @returns {undefined}
			 */

			$rootScope.changeLanguage = function(lang) {
				$rootScope.lang = Global.language(lang);
				if($rootScope.authenticated){
					Users.updateLanguage($rootScope.lang).success(function(user){
						$rootScope.user = user;
					}).error(function(errors){
						
					});
				}
			};

			/**
			 * Open notification window.
			 * 
			 * @param {string} message, {string} title
			 * @returns {undefined}
			 */

			$rootScope.notify = function(message, title) {
				var modalInstance = $modal.open({
					templateUrl: '/partials/notification.html',
					controller: ModalBasicCtrl,
					windowClass: 'notificationModal',
					resolve: {
						message: function() {
							return message;
						},
						title: function() {
							return title;
						},
						data: function() {
							return undefined;
						}
					}
				});
				modalInstance.result.then(function() {
				}, function() {
				});
			};

			/**
			 * Open approve window.
			 * 
			 * @param {string} message, {string} title, {function} callback
			 * @returns {undefined}
			 */

			$rootScope.approve = function(message, title, callback) {
				var modalInstance = $modal.open({
					templateUrl: '/partials/approveDialog.html',
					controller: ModalBasicCtrl,
					windowClass: 'approveModal',
					resolve: {
						message: function() {
							return message;
						},
						title: function() {
							return title;
						},
						data: function() {
							return undefined;
						}
					}
				});
				modalInstance.result.then(function(approved) {
					if(approved) {
						console.log('approved');
						callback();
					}
				}, function() {
				});
			};

			/**
			 * Dismiss alert
			 * 
			 * @param {int} index
			 * @returns {undefined}
			 */

			$rootScope.closeAlert = function(index) {
			    $rootScope.alerts.splice(index, 1);
			};
		}])
	//welcome controller DOM stuff
	.run(['$rootScope', '$location',
		function($rootScope, $location) {			
			$(document)
				//scroll down
				.on("click", "a[class=go_to_bottom]", function(e) {
					$('html, body').animate({scrollTop: $(document).height()}, 'slow');
				})
				// scroll down on arrow click or mouseover
				.on("click, mouseover", "#arrow", function(e) {
					$('html, body').animate({scrollTop: $('#arrow').offset().top - 50}, 'slow');
				});

			var button_shown = false;
			$(window).on("scroll", function() {
				if($location.path() === "/"){
					var $window = $(window);
					$rootScope.$apply(function() {
						// checks if scrolled to bottom and hides arrow if yes
						if($('.info').offset().top + 32 < $window.scrollTop() + $window.height()){
							$rootScope.isAtBottom = true;
						} else{
							$rootScope.isAtBottom = false;
						}

						//// is register button visible?
						if(!button_shown && isScrolledIntoView($("#signupButton"))){
							ga('send', 'event', 'scrolling', 'scrolled_to_register_button');
							button_shown = true;
						}
					});
				}
			});

			function isScrolledIntoView(elem) {
				var docViewTop = $(window).scrollTop();
				var docViewBottom = docViewTop + $(window).height();

				var elemTop = $(elem).offset().top;
				var elemBottom = elemTop + $(elem).height();

				return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
			}
		}]);

'use strict';

angular.module('bibliofair')
	//routing
	.config(['$routeProvider', '$httpProvider', '$provide',
		function($routeProvider, $httpProvider, $provide) {
			$routeProvider
				.when('/', {
					templateUrl: '/partials/welcome.html',
					controller: welcomeControl
				})
				.when('/home', {
					templateUrl: '/partials/private/home.html',
					controller: homeControl
				})
				.when('/library', {
					templateUrl: '/partials/private/library.html',
					controller: libraryControl
				})
				.when('/account', {
					templateUrl: '/partials/private/account.html',
					controller: accountControl})
				.otherwise({
					redirectTo: '/'}
				);

			//interceptor
			$provide.factory('myHttpInterceptor', function($q, $location, $rootScope) {
				return {
					'response': function(response) {
						return response || $q.when(response);
					},
					'responseError': function(rejection) {
						var status = rejection.status;
						if(status === 401){
							$rootScope.redirect = $location.url(); // save the current url so we can redirect the user back
							if($location.path() === '/en' || $location.path() === '/cz'){
							}
							else{
								$location.path('/');
								$location.replace();
							}
						}
						return $q.reject(rejection);
					}
				};
			});
			$httpProvider.interceptors.push('myHttpInterceptor');
		}])
	//translator
	.config(['$translateProvider', function($translateProvider) {
			$.extend(translateEN, window.translations.en);
			$.extend(translateCS, window.translations.cs);
			$translateProvider.translations('en', translateEN);
			$translateProvider.translations('cs', translateCS);
			$translateProvider.preferredLanguage('cs');
		}
	])
	//HTML5 location mode
	.config(['$locationProvider', function($locationProvider) {
			$locationProvider.html5Mode(true).hashPrefix('!');
		}
	]);

'use strict';

/*angular.module('bibliofair').directive('info', function() {
	var directiveObject = {
		restrict: 'A',
		templateUrl: '/partials/info.html',
		link: function(scope, element, attrs) {
			if(attrs.info === 'welcome')
				scope.loc = 'welcome';
		}
	};
	return directiveObject;
});*/

/**
 * Validations.
 */

angular.module('bibliofair')
	//unique username
	.directive('uniqueUsername', ['Users', function(Users) {
			return {
				require: 'ngModel',
				link: function($scope, elem, attrs, $ctrl) {
					$scope.busy = false;
					$scope.$watch(attrs.ngModel, function(username) {
						// hide old error messages
						$ctrl.$setValidity('exists', true);

						if(!username){
							return;
						}

						// show spinner
						$scope.busy = true;

						// send request to server
						Users.usernameExists(username).success(function(exists) {
							if(exists === "true"){
								$ctrl.$setValidity('exists', false);
							}
						})['finally'](function() {
							$scope.busy = false;
						});
					});
				}
			};
		}])
	//unique e-mail
	.directive('uniqueEmail', ['Users', function(Users) {
			return {
				require: 'ngModel',
				link: function($scope, elem, attrs, $ctrl) {
					$scope.busy = false;
					$scope.$watch(attrs.ngModel, function(email) {
						// hide old error messages
						$ctrl.$setValidity('exists', true);

						if(!email){
							return;
						}

						// show spinner
						$scope.busy = true;

						// send request to server
						Users.emailExists(email).success(function(exists) {
							if(exists === "true"){
								$ctrl.$setValidity('exists', false);
							}
						})['finally'](function() {
							$scope.busy = false;
						});
					});
				}
			};
		}]);

angular.module('bibliofair').factory('Books', ['$http', function($http) {
        return {
            count: function() {
                return $http.get('/api/books/count');
            },
            get: function(id) {
                //no id or id is object -> get all the books
                if(!id || typeof id === "object"){
                    return this.getAll(id);
                }

                return $http.get('/api/books/' + id);
            },
            getAll: function(params) {
                return $http.post('/api/books', params);
            },
            search: function(isbn) {
                return $http.get('/api/books/search/' + isbn);
            },
            request:function(from, to, book, language) {
                return $http.post('/api/books/request', {
                    from: from,
                    to: to,
                    book: book,
					language: language
                });
            },
            report:function(book) {
                return $http.get('/api/books/report/' + book);
            }
        };
    }]);
'use strict';

//Global service for global variables
angular.module('bibliofair').factory('Global', ['$translate', '$cookies',
	function($translate, $cookies) {
		return{
			user: function() {
				return window.user;
			},
			authenticated: function() {
				return !!window.user;
			},
			language: function(language) {
				if(language){
					$cookies.lang = language;
					$translate.use(language);
					return language;
				}
				return $cookies.lang;
			}
		};
	}
]);
angular.module('bibliofair').factory('Library', ['$http', function($http) {
        return {
            read: function() {
                return $http.get("/api/library");
            },
            add: function(book) {
                return $http.post("/api/library", book);
            },
            update: function(book, data) {
                return $http.put("/api/library/" + book, data);
            },
            remove: function(book) {
                return $http.delete("/api/library/" + book);
            },
			transfer: function(book, to, type){
				return $http.post("/api/library/transfer", {
					book: book,
					to: to,
					type: type
				});
			},
			returned: function(book, to){
				return $http.post('/api/library/returned',{
					book: book,
					to: to
				});
			}
        };
    }]);
angular.module('bibliofair').factory('Users', ['$http', function($http, $rootScope) {
		return {
			signUp: function(user) {
				return $http.post("/signup", user);
			},
			signIn: function(user) {
				return $http.post("/signin", user);
			},
			signOut: function() {
				return $http.get("/signout");
			},
			recover: function(email) {
				return $http.get("/recover/" + email);
			},
			me: function() {
				return $http.get("/me");
			},			
			updateLanguage: function(language) {
				return $http.put("/api/users/language", {
					language: language
				});
			},
			updatePassword: function(password) {
				return $http.put("/api/users/password", {
					password: password
				});
			},
			updateLocation: function(coordinates) {
				return $http.put("/api/users/location", {
					coordinates: coordinates
				});
			},
			/** check if exists */
			exists: function(user){
				return $http.get('/api/users/exists/' + user);
			},
			emailExists: function(email){
				return $http.get('/api/users/exists/' + email);
			},
			usernameExists: function(username){
				return $http.get('/api/users/exists/' + username);
			}
		};
	}]);
angular.module('bibliofair').factory('Utils', [function() {
		return {
			/*
			 * Convert ISBN10 into ISBN13.
			 * 
			 * @param {string} isbn10 String of length 10, must be a legal ISBN10. No dashes!
			 * @returns {string} isbn10
			 */
			ISBN10toISBN13: function(isbn10) {
				if(typeof isbn10 !== 'string' || isbn10.length !== 10)
					return false;

				var sum = 38 + 3 * (parseInt(isbn10[0]) + parseInt(isbn10[2]) + parseInt(isbn10[4]) + parseInt(isbn10[6])
					+ parseInt(isbn10[8])) + parseInt(isbn10[1]) + parseInt(isbn10[3]) + parseInt(isbn10[5]) + parseInt(isbn10[7]);

				var checkDig = (10 - (sum % 10)) % 10;

				return "978" + isbn10.substring(0, 9) + checkDig;
			},
			/**
			 * Convert ISBN13 into ISBN10.
			 * 
			 * @param {string} isbn13 String of length 13, must be a legal ISBN13. No dashes!
			 * @returns {string} isbn10 ISBN10
			 */
			ISBN13toISBN10: function(isbn13) {
				if(typeof isbn13 !== 'string' || isbn13.length !== 13)
					return false;

				var start = isbn13.substring(3, 12);
				var sum = 0;
				var mul = 10;
				var i;

				for (i = 0; i < 9; i++){
					sum = sum + (mul * parseInt(start[i]));
					mul -= 1;
				}

				var checkDig = 11 - (sum % 11);
				if(checkDig === 10){
					checkDig = "X";
				} else if(checkDig === 11){
					checkDig = "0";
				}

				return start + checkDig;
			},
			/**
			 * Get username from email address (e.g. john.doe from john.doe@email.com).
			 * 
			 * @param {string} email
			 * @returns {string} username
			 */
			usernameFromEmail: function(email){
				return email.split("@")[0];
			},
			/**
			 * Encrypt password.
			 * 
			 * @param {string} password
			 * @param {string} salt (optional)
			 * @returns {string} String with the length of the given password. 
			 */
			encrypt: function(password, salt) {
				salt = salt || "riafoilbib";
				return CryptoJS.SHA3(password + salt, {outputLength:256}).toString().substring(0,password.length);
			},
		};
	}]);
'use strict';
var ModalBookCtrl = function($rootScope, $scope, $modalInstance, $translate, book, Library, Books) {
	$scope.details_view = book;
	//if(book.published){
	//	$scope.details_view.published = new Date(book.published).getFullYear();
	//}
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};

'use strict';
var ModalBrowseCtrl = function($rootScope, $scope, $modalInstance, $translate, book, Library, Books) {
	$scope.details_view = book;
	//if(book.published){
	//	$scope.details_view.published = new Date(book.published).getFullYear();
	//}
	$scope.report = function() {
		if(!$scope.report_sent){
			Books.report(book._id).success(function(data) {
				$scope.report_sent = true;
				ga('send', 'event', 'Report', 'Book reported');
			});
		}
	};
	$scope.sendRequest = function(owner) {
		$rootScope.approve(undefined, $translate.instant('HOME.MODAL.REQUEST_APPROVE'), function () {
			Books.request($rootScope.user.username, owner.username, book._id, $rootScope.user.language).success(function(data) {
				owner.style = true;
				owner.message = $translate.instant('HOME.MODAL.REQUEST_SENT');
				console.log(data);

				ga('send', 'event', 'Request', 'Sent request');
			}).error(function(error) {
				$rootScope.notify(error);
				console.log(error);
			});
		});
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.owners = [];
	$scope.draw_map = function() {
		var map_width = $("#map_row").width();
		$("#map").css("width", map_width);
		var options = {
			elt: document.getElementById('map'), /*ID of element on the page where you want the map added*/
			zoom: 2, /*initial zoom level of the map*/
			latLng: {lat: 30, lng: -30}, /*center of map in latitude/longitude */
			mtype: 'map', /*map type (osm)*/
			bestFitMargin: 0, /*margin offset from the map viewport when applying a bestfit on shapes*/
			zoomOnDoubleClick: true                    /*zoom in when double-clicking on map*/
		};
		$scope.map = new MQA.TileMap(options);
		MQA.withModule('largezoom', 'viewoptions', 'insetmapcontrol', 'mousewheel', function() {
			$scope.map.addControl(
				new MQA.LargeZoom(),
				new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5, 5))
				);
//$scope.map.enableMouseWheelZoom();
		});
		Books.get($scope.details_view._id).success(function(data) {
			for (var i = 0; i < data.users.length; i++){
				var new_user = {username: data.users[i].username, style: false, message: $translate.instant('HOME.MODAL.REQUEST')}
				for (var j = 0; j < data.users[i].library.length; j++){
					if(data.users[i].library[j].id === $scope.details_view._id){
						new_user.actions = data.users[i].library[j].actions;
						new_user.note = data.users[i].library[j].note;
					}
				}
				if(data.users[i].loc.coordinates && data.users[i].loc.coordinates.length == 2 && data.users[i].loc.coordinates != [-30, 30]){
					var point = new MQA.Poi({lat: data.users[i].loc.coordinates[1], lng: data.users[i].loc.coordinates[0]});
					var icon = new MQA.Icon("img/poi_small.gif", 21, 32);
					point.setIcon(icon);
					point.setRolloverContent(data.users[i].username);
					$scope.map.addShape(point);
				}
				$scope.owners.push(new_user);
				$scope.map.bestFit(false, 4, 12);
				$scope.map.setZoomLevel($scope.map.zoom - 1);
			}
		});
	};
};

'use strict';
var ModalLibraryCtrl = function($rootScope, $scope, $modalInstance, book, Library, $translate) {
	$scope.details_view = book;
	//if(book.published){
	//	$scope.details_view.published = new Date(book.published).getFullYear();
	//}
	$scope.updateActions = function() {
		Library.update($scope.details_view._id, {
			actions: $scope.details_view.actions
		}).success(function(data) {
			console.log(data);
		});
	};
	$scope.save = function() {
		Library.update($scope.details_view._id, {
			note: $scope.details_view.note
		}).success(function(data) {
			console.log(data);
		});
	};
	$scope.remove = function() {
		$rootScope.approve(undefined, $translate.instant('LIBRARY.APPROVE_REMOVE'), function () {
			$modalInstance.close('remove');		
		});
	};
	$scope.removeInstant = function() {
		$modalInstance.close('remove');		
	};
	$scope.edit = function() {
		$modalInstance.close('edit');		
	};
	$scope.transfer = {
		send: function () {
			var transfer = angular.copy($scope.transfer);
			Library.transfer(book._id, transfer.user, transfer.type).success(function(data){
				$scope.details_view.lent = data.lent;
				if(transfer.type === "permanent"){
					$rootScope.notify($translate.instant('LIBRARY.TRANSFER.SUCCESS_PERMANENT') + transfer.user + ".");
					$scope.removeInstant();
				}
				else if(transfer.type === 'temporary'){
					$rootScope.notify($translate.instant('LIBRARY.TRANSFER.SUCCESS_TEMPORARY') + transfer.user + ".");
					$scope.cancel();
				}
				
			}).error(function(errors){
				if(errors[0].normalized){
					$scope.transfer.error = errors[0].message;
				}
				else{
					console.log(errors);
				}
			});
		},
		returned: function(to){
			Library.returned(book._id, to).success(function(data){
				$scope.details_view.lent = data.lent;
				$rootScope.notify($translate.instant('LIBRARY.TRANSFER.SUCCESS_RETURNED'));
				$scope.cancel();
			}).error(function(errors){
				console.log(errors);
			})
		}
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
};

'use strict';
var ModalRecoveryCtrl = function($scope, $modalInstance, $translate, Users) {
	$scope.remove = function() {
		$modalInstance.close('remove');
	};
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.send_button = $translate.instant('RECOVERY.SEND');

	/**
	* Send the recovery email.
	* 
	* @param {string} email
	* @returns {undefined}
	*/

	$scope.recover = function(email) {
		$scope.message = undefined;
		$scope.sending = true;
		$scope.send_button = $translate.instant('RECOVERY.SENDING');
		var always = function () {
			$scope.sending = false;
			$scope.send_button = $translate.instant('RECOVERY.SEND');
		}
		Users.recover(email).success(function(data) {
			$scope.message = $translate.instant('RECOVERY.SENT');
			always();
		}).error(function(error) {
			$scope.message = $translate.instant('errors.email.invalid');
			always();
		});
	};
};

'use strict';
var ModalBasicCtrl = function ($scope, $modalInstance, message, title, data) {

	/*
	 * Edit book modal setting
	 */
	if (data) {
		$scope.languages = languages;
		$scope.newbook = data.book;
		$scope.template = data.template;
		$scope.editing = true;
		$scope.save = function () {
			$modalInstance.close($scope.newbook);
		};
		$scope.check = function () {
			return [];
		};
		$scope.retrieveBooks = function () {
		};
	}

	/*
	 * Notification modal setting
	 */

	$scope.message = message;
	$scope.title = title;

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	$scope.approve = function() {
		$modalInstance.close(true);
	};
	$scope.disapprove = function() {
		$modalInstance.close(false);
	};
};

'use strict';
function welcomeControl($rootScope, $location, $scope, Global, Books, Users, Utils, $translate) {

	//redirect to '/home' if signed in
	if($rootScope.authenticated && $location.path() === "/"){
		$location.path("/home");
	}

	$scope.usernameFromEmail = function() {
		if($scope.signup.email){
			$scope.signup.username = Utils.usernameFromEmail($scope.signup.email);
		}
	};

	/////////////////////
	$scope.bookOrder = 'title';

	//book count
	Books.count().success(function(data) {
		setTimeout(function(){
			$scope.books_available = data;
		},100);
	}).error(function(error) {
		console.log(error);
	});

	//initial books to show
	$rootScope.books = $rootScope.books || [];
	if($rootScope.books.length < 6) {
		Books.get({limit: 6}).success(function(data) {
			$rootScope.books = data;
		});
	}

	/**
	 * Retrieve (at maximum) 6 books based on search query.
	 */
	$scope.retrieveBooks = function() {
		Books.get({
			query: $scope.search_query,
			limit: 6
		}).success(function(data) {
			var arr = $rootScope.books.concat(data);
			$rootScope.books = uniqBooks(arr, function(a, b) {
				if(a._id < b._id)
					return -1;
				else if(a._id > b._id)
					return 1;
				else
					return 0;
			});
		});
	};

	/**
	 * Sign the user up.
	 * 
	 */
	$scope.signUp = function() {
		var user = angular.copy($scope.signup);
		Users.signUp({
			username: user.username,
			email: user.email,
			password: Utils.encrypt(user.password)
		}).success(function(data) {
			//$scope.signupMessage = $translate.instant('WELCOME.VERIFICATION_SENT') + user.email;
			$rootScope.notify($translate.instant('WELCOME.VERIFICATION_SENT') + user.email);
			// sign the user in
			Users.signIn({
				email: user.email,
				password: Utils.encrypt(user.password),
				remember: false
			}).success(function(user) {
				$rootScope.authenticated = true;
				$rootScope.user = user;
				$rootScope.lang = Global.language($rootScope.user.lang);
				$location.path('/home');
			});
			//GA register goal
			ga('send', 'event', 'Register', 'register');
		}).error(function(errors) {
			if(errors[0].normalized){
				$scope.signupMessage = errors[0].message;
			}
			else{
				console.error(errors);
			}
		});
	};

	/**
	 * Google analytics.
	 */

	ga('send', 'pageview', '/');
};

angular.module('bibliofair').controller('HeaderController', ['$rootScope', '$scope', '$location', 'Users', 'Utils', 'Global', '$modal',
	function($rootScope, $scope, $location, Users, Utils, Global, $modal) {

		/**
		 * Sign the user in (locally).
		 * 
		 * @param {string} login
		 * @param {string} password
		 * @returns {undefined}
		 */

		$scope.signIn = function() {
			var user = angular.copy($scope.signin);
			Users.signIn({
				email: user.login,
				password: Utils.encrypt(user.password),
				remember: user.remember ? true : false
			}).success(function(user) {
				$rootScope.authenticated = true;
				$rootScope.user = user;
				//language
				$rootScope.lang = Global.language($rootScope.user.lang);
				//redirect
				$location.path('/home');
			}).error(function(errors) {
				if(errors[0].normalized){
					$rootScope.login_message = errors[0].message;
				}
			});
		};

		/**
		 * Sign the user out.
		 * 
		 * @returns {undefined}
		 */

		$scope.signOut = function() {
			Users.signOut().success(function() {
				$rootScope.user = null;
				$rootScope.authenticated = false;
				$location.path('/');
			});
		};

		/**
		 * Toggle the sign in form.
		 * 
		 * @returns {undefined}
		 */

		$scope.toggleSignin = function() {
			var $signin = $("#signin");
			if($signin.is(":hidden")){
				$signin.show();
				//focus login input field
				$("#signinLogin").focus();
				//bind to mousedown as bootstrap dropdown-toggles block the click event (they use an internal function clearMenus(); talk about good pracice, huh...)
				$(document).on("mousedown.signin", function(e) {
					var $signin = $("#signin"),
						$target = $(e.target),
						isOutOfDropdown = $target.parents("#signin").size() === 0 && $target.attr("id") !== "signin",
						isOutOfModal = $target.parents(".modal").size() === 0 && !$target.hasClass("modal") && !$target.hasClass("modal-backdrop");

					//hide only if signin is visible and not clicked in the dropdown, a modal or on the opener 
					if($signin.is(":visible") && isOutOfDropdown && isOutOfModal && $target.attr("id") !== "signinTrigger"){
						$signin.hide();
						$(document).off("mousedown.signin");
					}
				});
			}
			else{
				$signin.hide();
				$(document).off("mousedown.signin");
			}
		};

		/**
		 * Open password recovery modal.
		 */

		$scope.recoverPassword = function() {
			var modalInstance = $modal.open({
				templateUrl: '/partials/recovery.html',
				controller: ModalRecoveryCtrl,
				windowClass: 'recovery',
				resolve: {
					//
				}
			});

			modalInstance.result.then(function() {
			});
		};

	}]);

'use strict';
function homeControl($rootScope, $scope, $location, $modal, Users, Books) {
	//redirect to '/' if not signed in
	if(!$rootScope.authenticated){
		$location.path("/");
	}
	
	//maps
	if(!$rootScope.mapIsLoaded) {
		$rootScope.mapIsLoaded = true;
		$.getScript("http://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluub250r2g%2Caa%3Do5-9u8wl4");
	}
	
	//sorting & pagination
	$rootScope.books = $rootScope.books || [];
    $scope.bookOrder = 'title';
    $scope.currentPage = 1;
    $scope.pageSize = 12;

	var normalizeBooks = function (data) {
		var books = [];
		for (var i = 0; i < data.length; i++){
			data[i].distance = i + $rootScope.books.length;
			data[i].actions = {};
			for (var j = 0; j < data[i].users.length; j++){
				for (var k = 0; k < data[i].users[j].library.length; k++){
					if(data[i].users[j].library[k].id === data[i]._id){
						if(data[i].users[j].library[k].actions){
							if(data[i].users[j].library[k].actions.sell === true)
								data[i].actions.sell = true;
							if(data[i].users[j].library[k].actions.donate === true)
								data[i].actions.donate = true;
							if(data[i].users[j].library[k].actions.lend === true)
								data[i].actions.lend = true;
							if(data[i].users[j].library[k].note)
								data[i].note = data[i].users[j].library[k].note;
						}
					}
				}
			}
			books.push(data[i]);
		}
		return books;
	}

	//// Load some books at the beginning
	var loadLibraryBooks = function() {
		$rootScope.books = [];
		$scope.loading = true;

        if($rootScope.user && $rootScope.user.loc.coordinates.length === 2){
            $scope.locationSet = true;
        }

        Books.get({
            limit: 60,
            lng: $rootScope.user.loc.coordinates[0],
            lat: $rootScope.user.loc.coordinates[1],
            radius: 10000
        }).success(function(data) {
            if(data){
                $scope.loading = false;
                if($scope.locationSet)
                    $scope.bookOrder = "distance";
				$rootScope.books = normalizeBooks(data);
                $rootScope.books = uniqBooks($rootScope.books, function(a, b) {
                    if(a._id < b._id)
                        return -1;
                    else if(a._id > b._id)
                        return 1;
                    else
                        return 0;
                });
            }
        });
    };
	if($rootScope.books.length < 12) {
		loadLibraryBooks();
	}

    //// Real-time retrieving with writing search query
    $scope.retrieveBooks = function() {
        Books.get({
            query: $scope.search,
            limit: 12
        }).success(function(data) {
            $rootScope.books = $rootScope.books.concat(normalizeBooks(data));
            $rootScope.books = uniqBooks($rootScope.books, function(a, b) {
                if(a._id < b._id)
                    return -1;
                else if(a._id > b._id)
                    return 1;
                else
                    return 0;
            });
        });

    };
	
	/**
	 * Show book detail (in a modal).
	 * 
	 * @param {type} book
	 * @returns {undefined}
	 */
	
    $scope.open = function(book) {
        var modalInstance = $modal.open({
            templateUrl: '/partials/private/browse_detail.html',
            controller: ModalBrowseCtrl,
            resolve: {
                book: function() {
                    return book;
                }
            }
        });
        modalInstance.result.then(function() {
        }, function() {
        });
    };
    
	/**
	 * GA.
	 */
	
    ga('send', 'pageview', '/');
};

'use strict';
function libraryControl($rootScope, $scope, $location, $modal, $translate, $filter, Library, Books, Utils) {
	//redirect to '/' if not signed in
	if(!$rootScope.authenticated){
		$location.path("/");
	}
	
	$scope.selected_books = [];
	$scope.languages = languages;
	
	//load books from user's library
	$scope.loading = true;
	Library.read().success(function(books) {
		$scope.mybooks = books;
		$scope.loading = false;
	});

	// Load some books in the beginning
	Books.get({
		limit: 60,
		noUsers: true
	}).success(function(data) {
		$scope.books = data;
	});

	/**
	 * Load books in real-time for typeahead
	 */
	$scope.retrieveBooks = function (query) {
		Books.get({
			query: query,
			limit: 12,
			noUsers: true
		}).success(function(data) {
			$scope.books = $scope.books.concat(data);
		});
	};

	/**
	 *	Add a book to user's library. 
	 */

	$scope.addBook = function(bookArg, done) {
		done = done || function(){
			$rootScope.notify($translate.instant('LIBRARY.ADD.SUCCESS'));
		};
		
		var book = bookArg || $scope.newbook;
		if(book.title && book.author){
			if(book.isbn){
				if(book.isbn.length === 10)
					book.isbn = Utils.ISBN10toISBN13(book.isbn);
			}
			Library.add(book).success(function(book) {
				$scope.newbook = {};
				$scope.mybooks.push(book);
				$scope.warning_text = "";
				done();
				ga('send', 'event', 'book', 'add');
			}).error(function(error) {
				console.log(error);
				$scope.warning_text = $translate.instant('LIBRARY.ADD.INVALID_PUBLISHED');
			});
		} else{
			$scope.warning_text = $translate.instant('LIBRARY.ADD.NOT_FILLED');
		}
	};
	// on selection of one of typeaheads checks if it matches only one result and if so, fills the rest of form
	$scope.selectBook = function(item, scope) {
		if(scope) $scope = scope;
		var template = {};
		for (var prop in $scope.newbook){
			template[prop] = $scope.newbook[prop];
		}
		if(item) {
			template.title = item.title;
			template.author = item.author;
		}
		delete template.edition;
		delete template.volume;
		delete template.actions;
		delete template.language;
		delete template.note;
		var arr = $filter('filter')($scope.selected_books, template);
		template.isbn = Utils.ISBN13toISBN10(template.isbn);
		if(template.isbn){
			var arr2 = $filter('filter')($scope.selected_books, template);
			arr = arr.concat(arr2);
		}
		$scope.selected_books = uniqBooks(arr, function(a, b) {
			if(a.title < b.title)
				return -1;
			else if(a.title > b.title)
				return 1;
			else
				return 0;
		});
		if($scope.selected_books.length == 1){
			$scope.newbook = $scope.selected_books[0];
		}
		for (var prop in $scope.selected_books[0]){
			var flag = true;
			$scope.selected_books.forEach(function(element) {
				if($scope.selected_books[0][prop] != element[prop]){
					flag = false;
				}
			});
			if(flag)
				$scope.newbook[prop] = $scope.selected_books[0][prop];
		}
	};
	///// EUROPEAN LIBRARY API ////////////
	// is called on each change of ISBN but gives call after 10th char only
	$scope.searchTel = function(query) {
		if(query === $scope.newbook.isbn && typeof query === 'string'){
			$scope.newbook.isbn = query = query.replace(/-/g, '');
		}
		$scope.tel = [];
		if(query.length >= 10){
			var processData = function(data) {
				for (var i = 0; i < data.Results.length; i++){
					if(data.Results[i].TITLE && data.Results[i].CREATOR){
						var addbook = {title: data.Results[i].TITLE[0], author: data.Results[i].CREATOR[0]};
						if(data.Results[i].SUBTITLE)
							addbook.subtitle = data.Results[i].SUBTITLE[0];
						if(data.Results[i].YEAR)
							addbook.published = data.Results[i].YEAR[0];
						if(data.Results[i].LANGUAGE)
							addbook.language = data.Results[i].LANGUAGE[0];
						addbook.edition = 1;
						addbook.volume = 1;
						if(query.length == 10)
							addbook.isbn = Utils.ISBN10toISBN13(query);
						else
							addbook.isbn = query;
						$scope.tel.push(addbook);
					}
				}
				var template = {};
				for (var prop in $scope.newbook){
					template[prop] = $scope.newbook[prop];
				}
				delete template.edition;
				delete template.volume;
				delete template.actions;
				delete template.language;
				delete template.note;
				if(template.isbn.length === 10)
					template.isbn = Utils.ISBN10toISBN13(template.isbn);
				$scope.tel = $filter('filter')($scope.tel, template, true);
				$scope.selected_books = $scope.selected_books.concat($scope.tel);
				if($scope.tel.length === 1){
					$scope.newbook = $scope.tel[0];
				}
				$scope.selectBook();
			}
			if(/97[89].*/.test(query)){
				if(query.length === 13){
					Books.search(query).success(function(data) {
						processData(data);
					});
					Books.search(Utils.ISBN13toISBN10(query)).success(function(data) {
						processData(data);
					});
				}
			}
			else{
				Books.search(query).success(function(data) {
					processData(data);
				});
				Books.search(Utils.ISBN10toISBN13(query)).success(function(data) {
					processData(data);
				});
			}
		}
	};
	$scope.check = function(data, prop, val) {
		//if($scope.selected_books.length === 0)
		$scope.selected_books = $scope.books;
		var template = {};
		for (var prop in $scope.newbook){
			template[prop] = $scope.newbook[prop];
		}
		delete template.edition;
		delete template.volume;
		delete template.actions;
		delete template.language;
		delete template.note;
		if(template.isbn && template.isbn.length == 10)
			template.isbn = Utils.ISBN10toISBN13(template.isbn);
		var arr = $filter('filter')($scope.selected_books, template);
		arr = uniqBooks(arr, function(a, b) {
			if(a.title + a.author < b.title + b.author)
				return -1;
			else if(a.title + a.author > b.title + b.author)
				return 1;
			else
				return 0;
		});
		return arr;
	};
	
	/**
	 * Show book detail (in a modal window).
	 * 
	 * @param {object} book
	 * @returns {undefined}
	 */
	var openEditModal = function(book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/notification.html',
			controller: ModalBasicCtrl,
			resolve: {
				data: function () {
					return {
						book: book,
						template: '/partials/private/add_book.html'
					};
				},
				message: function () { return ''; },
				title: function () { return $translate.instant('DETAIL.EDIT_TITLE'); }
			}
		});

		modalInstance.result.then(function(editedBook) {
			if(typeof book === 'object'){
				Library.remove(editedBook._id).success(function(data) {
					var index = -1;
					index = $scope.mybooks.indexOf(editedBook);
					if(index >= 0) $scope.mybooks.splice(index, 1);
					$scope.addBook(editedBook, function(){ $scope.open(editedBook); } );
				}).error(function(error){
					console.log(error);
				});
			}
		});
	}
	
	$scope.open = function(book) {
		var modalInstance = $modal.open({
			templateUrl: '/partials/private/library_detail.html',
			controller: ModalLibraryCtrl,
			resolve: {
				book: function() {
					return book;
				}
			}
		});

		modalInstance.result.then(function(action) {
			if(action === 'remove'){
				Library.remove(book._id).success(function(data) {
					var index = -1;
					index = $scope.mybooks.indexOf(book);
					if(index >= 0)
						$scope.mybooks.splice(index, 1);
				}).error(function(error){
					console.log(error);
				});
			} else if(action === 'edit') {
				openEditModal(book);
			}
		});
	};
	
	/**
	 * GA.
	 */
	
	ga('send', 'pageview', '/library');
};

'use strict';
function accountControl($rootScope, $location, $scope, $translate, Users, Utils) {

	//redirect to '/' if not signed in
	if(!$rootScope.authenticated){
		$location.path("/");
	}

	//// Sets width of the map, is needed in IE
	var map_width = $("#map_row").width();
	$("#map").css("width", map_width);
	$("#cross").css("left", map_width / 2 - 18);

	//// set default coordinates
	$scope.centerLat = 30;
	$scope.centerLng = -30;

	//// Save location
	$scope.save_loc_text = $translate.instant('ACCOUNT.SAVE_LOC');
	$scope.saveLoc = function() {
		$scope.save_loc_text = $translate.instant('ACCOUNT.SAVING');
		Users.updateLocation([$scope.centerLng, $scope.centerLat]).success(function(user) {
				$rootScope.user = user;
				//marker to the map
				var point = new MQA.Poi({lat: $scope.centerLat, lng: $scope.centerLng});
				point.setIcon(new MQA.Icon("img/poi_small.gif", 21, 32));
				$scope.map.removeAllShapes();
				$scope.map.addShape(point);
		}).error(function(error){
			console.log(error);
		})['finally'](function(){
			$scope.save_loc_text = $translate.instant('ACCOUNT.SAVED_LOC');
		});
	};

	//// Search location via addresss - geocoding
	$scope.searchLoc = function(address) {
		var addr = address || $scope.searchAddress;
		MQA.withModule('nominatim', function() {
			MQA.Nominatim.processResults = function(results, map) {
				if(results.length === 0){
					//// if address was not found, I try searching without number at the end e.g. Praha instead of Praha 5
					if(/[ ][0-9]+$/.test(addr)){
						addr = addr.replace(/[ ][0-9]$/, "");
						$scope.searchLoc(addr);
					} else{
						$scope.$apply(function() {
							$scope.not_found_message = $translate.instant('ACCOUNT.NOT_FOUND');
						});
					}
				} else{
					$scope.not_found_message = undefined;
					map.setCenter(new MQA.LatLng(results[0].lat, results[0].lon), 11, {totalMs: 100, steps: 1});
				}
			};
			$scope.map.nominatimSearchAndAddLocation(addr, null);
		});
	};

	//// Download MQA script and draw map
	$scope.drawMap = function()
	{
		var draw = function () {
			var options = {
				elt: document.getElementById('map'), /*ID of element on the page where you want the map added*/
				zoom: 3, /*initial zoom level of the map*/
				latLng: {lat: 30, lng: -30}, /*center of map in latitude/longitude */
				mtype: 'map', /*map type (osm)*/
				bestFitMargin: 0, /*margin offset from the map viewport when applying a bestfit on shapes*/
				zoomOnDoubleClick: true                    /*zoom in when double-clicking on map*/
			};
			$scope.map = new MQA.TileMap(options);
			MQA.withModule('largezoom', 'viewoptions', 'geolocationcontrol', 'insetmapcontrol', 'mousewheel', function() {
				$scope.map.addControl(
					new MQA.LargeZoom(),
					new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5, 5))
				);
				$scope.map.enableMouseWheelZoom();
			});
			MQA.EventManager.addListener($scope.map, 'move', update_loc);
			MQA.EventManager.addListener($scope.map, 'drag', update_loc);
			MQA.EventManager.addListener($scope.map, 'dragend', update_loc);
			MQA.EventManager.addListener($scope.map, 'click', update_loc);
			MQA.EventManager.addListener($scope.map, 'doubleclick', update_loc);
			MQA.EventManager.addListener($scope.map, 'zoomend', update_loc);
			loadLoc();
		};
		if($rootScope.mapIsLoaded) {
			draw();
		} else {
			$rootScope.mapIsLoaded = true;
			$.getScript("http://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluub250r2g%2Caa%3Do5-9u8wl4", draw);
		}
	};

	//// load location if it is set and redraw map to that location
	var loadLoc = function(callback) {
		if($rootScope.user.loc.coordinates.length === 2){
			$scope.centerLng = $rootScope.user.loc.coordinates[0];
			$scope.centerLat = $rootScope.user.loc.coordinates[1];

			$scope.map.setCenter(new MQA.LatLng($scope.centerLat, $scope.centerLng), 11, {totalMs: 100, steps: 1});
			$scope.map.setZoomLevel(11);
			var point = new MQA.Poi({lat: $scope.centerLat, lng: $scope.centerLng});
			var icon = new MQA.Icon("img/poi_small.gif", 21, 32);
			point.setIcon(icon);
			$scope.map.addShape(point);
		}
	};

	//// Binding of $scope.center... with map coordinates, called upon any change, might be superfluous now, I can call $scope.map.getCenter only when saving coordinates
	var update_loc = function() {
		if(!$scope.$$phase){
			$scope.$apply(function() {
				$scope.centerLat = $scope.map.getCenter().lat;
				$scope.centerLng = $scope.map.getCenter().lng;
				$scope.save_loc_text = $translate.instant('ACCOUNT.SAVE_LOC');
			});
		} else{
			$scope.centerLat = $scope.map.getCenter().lat;
			$scope.centerLng = $scope.map.getCenter().lng;
			$scope.save_loc_text = $translate.instant('ACCOUNT.SAVE_LOC');
		}
	};

	//// Password changing 
	$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGE');
	$scope.savePass = function() {
		if($scope.new_password !== $scope.new_password_again){
			$scope.change_pass_message = $translate.instant('ACCOUNT.CHANGE.NOTEQUAL');
		}
		else if($scope.new_password && $scope.new_password.length < 6){
			$scope.change_pass_message = $translate.instant('ACCOUNT.CHANGE.SHORT');
		}
		else{
			$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGING');

			Users.updatePassword(Utils.encrypt($scope.new_password)).success(function() {
				$scope.change_pass_message = '';
				$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGED');
			}).error(function() {
				$scope.change_pass_message = $translate.instant('ACCOUNT.CHANGE.INCORRECT');
				$scope.save_pass_text = $translate.instant('ACCOUNT.CHANGE.CHANGE');
			});
		}
	};
	//// Google Analytics
	ga('send', 'pageview', '/account');
};

'use strict';
angular.module('bibliofair').filter('shorten', function() {
	return function(input, max) {
		if(input.length <= max)
			return input;
		else
			return input.slice(0, max - 1).concat("...");//.split(' ').pop().join(' ');
	};
});

angular.module('bibliofair').filter('paginationShift', function() {
	return function(input, start) {
		start = +start;
		return input.slice(start);
	};
});

angular.module('bibliofair').filter('actions', function() {
	return function(input, actions) {
		if(actions.sell || actions.donate || actions.lend){
			var ret = [];
			for (var i = 0; i < input.length; i++){
				if(input[i].actions) {
					if(actions.sell && input[i].actions.sell){
						ret.push(input[i]);
					} else if(actions.donate && input[i].actions.donate){
						ret.push(input[i]);
					} else if(actions.lend && input[i].actions.lend){
						ret.push(input[i]);
					}
				}
			}
			return ret;
		} else{
			return input;
		}
	};
});


'use strict';

angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if(window.location.hash === '#_=_'){
		window.location.hash = '';
	}

	//Then init the app
	angular.bootstrap(document, ['bibliofair']);
});