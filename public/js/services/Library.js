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