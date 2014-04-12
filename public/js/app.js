'use strict';

// create bibliofair module
angular.module('bibliofair', [
	'ngRoute',
	'ngSanitize',
	'ngCookies',
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
					Users.updateLanguage($rootScope.lang);
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
