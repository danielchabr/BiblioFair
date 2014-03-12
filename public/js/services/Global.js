'use strict';

//Global service for global variables
angular.module('myApp').factory('Global', [function() {
        return{
            user: function() {
                return window.user;
            },
            authenticated: function(){
                return !!window.user;
            },
            encrypt: function(password){
                return CryptoJS.SHA3(password, {outputLength: 256}).toString();
            }
        };
    }
]);