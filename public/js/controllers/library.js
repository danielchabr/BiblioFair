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
				//ga('send', 'event', 'book', 'add');
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
}
