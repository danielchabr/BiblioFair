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
