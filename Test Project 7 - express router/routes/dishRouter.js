const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());


/*
then on the dishRouter, it supports a method called route method, which can take in an 
endpoint as a parameter. So I would simply declare this endpoint a /. Now, you're wondering, 
shouldn't that be dishes? You will pretty soon see that I need to mount this Express router in
my index.js file. So in my index.js file, I will mount this express router at the /dishes endpoint. 
Mounting of an express router, again, one more concept that I want you to understand.
Again, I will illustrate that to you in a short while. 
Now, the dishRouter.route means that by using this approach, we are declaring the endpoint at one single 
location. Whereby you can chain all get, PUT, POST, delete methods already do this dish router. 
Now, when you look at index.js,, look at the way we implimented this. So we have app.all and then
/dishes, app.get/dishes and /dishes. Now, if you had made a mistake, and their instructing 
app.post /dishes instead if you just type /dish, then what happens? 
The POST operation will not be supported on dishes but will be supported on /dish endpoint.

*/

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    console.log("in all method");
    /*
    when you call next, what it means is that it'll continue on to look for additional
    specifications down below here, which will match this dishes endpoint. So this would be done for
    all the requests, get, put, post, and delete, on the dishes, and it'll continue on to the next one.
    */
    next();
})

// the req and res in this get is from the app.all so they are not the new once but the previously modified 
// once 
.get((req,res,next)=>{
    res.end(`all dishes will be served on frontend in some time`);
})

//if post request is coming to /dishes and then next() will drop the function control to app.post from app.all
.post((req,res,next)=>{
    /*
    whatever the JSON string contains in the req.body, but JSON string will be
    parsed into a JavaScript object and added in to the request object as a property body. 
    The JavaScript object points to whatever came in as the JSON string in the body of the 
    request message. So that is why I am able to parse the name property, the description property
    */
    res.end(` dish added : ${req.body.name} - ${req.body.description}`);
})

.put((req,res,next)=>{
    res.statusCode = 403;
    res.end(`${req.method} OPERATION NOT SUPPORTED `);
})

.delete((req,res,next)=>{
    res.end(`deleting all the dishes `);
});

module.exports=dishRouter;
// SEMI COLON IN ABOVE METHODS except delete ARE REMOVED AS WE HAVE CHAINED THEM WITH dishROUTER
