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