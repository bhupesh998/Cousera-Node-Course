const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url='mongodb://127.0.0.1:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log(`Connected to the Server`);

    var newDish=Dishes({
        name : "idli",
        description : "south dish"
    });

    newDish.save()
        .then((dish)=>{
            console.log(`Value of dish is :\n ${JSON.stringify(dish)}`);
            /*
            we'll find all the Dishes and then say exec. The exec will ensure that this is executed and 
            that it will return a promise and so that promise will be returned so that it can then chain 
            the method to the remaining ones. So you see how I am using promises and then I am invoking 
            the previous method so this one finds
             all the Dishes within my database, in the Dishes collection and then makes it available to me.
            */
            return Dishes.find({}).exec();
        })
        .then((dishes)=>{
            console.log(`dishes returened are \n ${JSON.stringify(dishes)}`);
            // below method will remove all the dishes from database
            return Dishes.remove({});
        })
        .then(()=>{
            return mongoose.connection.close();
        })
        .catch((err)=>{
            console.log(err);
        });
    
});
