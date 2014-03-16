var util = require('util'),
        messages = require("./messages");

exports.normalize = function(err, language) {
    var errors = [];
    if(err.name === "ValidationError"){
        //loop through the individual errors
        Object.keys(err.errors).forEach(function(key) {
            var error = err.errors[key];
            if(error.type === "user defined"){
                errors.push({
                    path: error.path,
                    type: error.message
                });
            }
            else{
                errors.push({
                    path: error.path,
                    type: error.type
                });
            }
        });
    }
    else{
        if(err.message){
            var error = err.message.split(".");
            errors.push({
                path: error[0],
                type: error[1]
            });
        }
        else{
            return err;
        }
    }
    
    //translate
    if(errors.length){
        errors.forEach(function(error){
            var message = messages[language]['errors'][error.path][error.type];
            if(message){
                error.message = message;
            }
        });
    }
    
    return {
        normalized: true,
        errors: errors
    };
};