var passport= require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('./models/user');

/*
if you are not using passport-local-mongoose when you set up a mongoose plugin that we have done, 
if you're not using that, then you need to write your own user authentication function here

exports.local=passport.use(new LocalStrategy(user defined function for checking authentication));

*/
exports.local=passport.use(new LocalStrategy(User.authenticate()));

/*
to track users in our application, we need to serialize and deserialize the user. 
So this basically takes the user information. Now recall that the passport authenticate will mount
the req.user or the user property to the request message and so that user information will be serialized 
and deserialized realized by using this saying serialize user and passport deserialize user. 
Also we'll say user deserialize user. These two functions they serialize user and deserialize user 
are provided on the user schema and model by the use of the passport-local-mongoose plugin here. 
So this will take care of whatever it is required for our support for sessions in passport
*/

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
