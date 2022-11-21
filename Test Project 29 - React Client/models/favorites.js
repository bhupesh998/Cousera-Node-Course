const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// below line  will load currency type in mongoose


const Dishes = new Schema({
    dish:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Dish'
    }
},
{
        timestamps:true
}); 

const favoriteSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    dishes :[Dishes]
},
{
        timestamps:true
});


var Favorites = mongoose.model('Favorite',favoriteSchema);

module.exports = Favorites;