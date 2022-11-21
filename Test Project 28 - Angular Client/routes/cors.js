const express = require('express');
const cors=require('cors');

const app = express();

const whitelist =['http://localhost:3000', 'http://localhost:3443','http://localhost:4200'];
var corsOptionDelegate = (req,callback)=>{
    var CorsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1){
        CorsOptions = { origin : true};
    }else{
        CorsOptions = { origin : false};
    }
    callback(null,CorsOptions);
};

/*
if you configure the cors Module by simply saying cors without any options, then that means this will reply back with access control allowOrigin with the wild cards toll. There are certain rules on which this is acceptable to do, especially whenever we perform get operations. It's okay to accept that. Otherwise, we'll say, corsWithOptions = cors, and then we'll supply the )corsOptionsDelegate) function that we have just defined earlier.

So that way, if you need to apply A cors with specific options to a particular route, we will use this function. Otherwise, we'll simply use the standard cors. Now that we have defined the cors-related code in cors.js, let's start applying this to the various routes
*/
exports.cors = cors();
exports.corsWithOptions = cors(corsOptionDelegate);