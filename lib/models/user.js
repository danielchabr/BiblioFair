'use strict';

var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var UserSchema = new Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{
        username:{type:String, required:true},
        email:{type:String, required:true}
    },
    language:{type:String, required:false, unique:false},
    token:{
        hash:{type:String, required:false},
        last:{type:Date, required:false}
    },
    loc:{
        type:{type:String},
        coordinates:{type:[Number]}
    },
    library:[{
            id:{type:Schema.Types.ObjectId, ref:'Books'},
            last_updated:{type:Date, required:false},
            actions:{
                sell:{type:Boolean},
                donate:{type:Boolean},
                lend:{type:Boolean}
            },
            note:{type:String, required:false}
        }]
});

mongoose.model('UserModel', UserSchema);