angular.module('myApp').factory('Books', ['$http', function($http) {
        return {
            //count all the books
            count:function() {
                return $http.get('/api/books/count');
            },
            //get a book by its id
            get:function(id) {
                //no id or id is object -> get all the books
                if (!id || typeof id === "object") {
                    return this.getAll(id);
                }

                return $http.get('/api/books/:id', {
                    id:id
                });
            },
            //get all the books
            getAll:function(params) {
                return $http.post('/api/books',params);
            }
        };
    }]);