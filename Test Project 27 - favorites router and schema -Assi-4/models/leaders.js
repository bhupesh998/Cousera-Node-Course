const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// below line  will load currency type in mongoose
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const leaderSchema = new Schema({
    name:{
        type : String,
        required : true,
        unique : true
    },
    description:{
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    designation : {
        type : String,
        required : true
    },
    abbr : {
        type : String,
        required : true
    },
    featured :{
        type : String,
        default : false
    }
},
{
    timestamps:true
});

var Leaders = mongoose.model('Leader',leaderSchema);

module.exports = Leaders;