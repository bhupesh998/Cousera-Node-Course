const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// below line  will load currency type in mongoose
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


const promotionSchema = new Schema({
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
    label : {
        type : String,
        default : ''
    },
    featured :{
        type : String,
        default : false
    },
    price : {
        type : Currency,
        required : true,
        min : 0
    }
},
{
    timestamps:true
});

var Promotions = mongoose.model('Promotion',promotionSchema);

module.exports = Promotions;