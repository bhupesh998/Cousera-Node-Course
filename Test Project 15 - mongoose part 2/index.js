const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url='mongodb://127.0.0.1:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db)=>{
    console.log(`Connected to the Server`);

    /*
    
    we will use a new method called dishes create which takes, as a parameter, the newDish to create and 
    then saves it in our application. So, instead of doing this newDish save, we can simply remove that and directly 
    deal with the dishes create method here.So, the dishes create method will take as a parameter
    a new document that needs to be stored in our database, and then creates and adds the document 
    to the database.

    */

    Dishes.create({
        name : "idli",
        description : "south dish"
    })
    .then((dish)=>{
        console.log(`Value of dish is :\n ${JSON.stringify(dish)}`);
        /*
        we'll find all the Dishes and then say exec. The exec will ensure that this is executed and 
        that it will return a promise and so that promise will be returned so that it can then chain 
        the method to the remaining ones. So you see how I am using promises and then I am invoking 
        the previous method so this one finds
            all the Dishes within my database, in the Dishes collection and then makes it available to me.
        */
        return Dishes.findByIdAndUpdate(dish._id,{ $set : {description : " tastes good in south"}}, 
                { new :true } ).exec();  // new : true specifcies that return the new updated dish
    })
    .then((dish)=>{
        console.log(`updated dish returned are \n ${JSON.stringify(dish)}`);

        dish.comments.push({
            rating : 5,
            comment : "tastes good",
            author : "bhupesh"
        });

        return dish.save();

    })
    .then((dish)=>{
        console.log(`Value of dish is :\n ${JSON.stringify(dish)}`);

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
