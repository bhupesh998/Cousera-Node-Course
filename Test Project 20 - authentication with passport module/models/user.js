const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    /* WILL BE ADDED BY PASSPORT-LOCAL-MONGOOSE PLUGIN
    username:{
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    */
    admin : {
        type : Boolean,
        required : false,
        default : false
    }
    
},
{
    timestamps:true
});

userSchema.plugin(passportLocalMongoose);

var Users = mongoose.model('User', userSchema);

module.exports = Users;