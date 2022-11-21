var passport= require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var Jwt=require('jsonwebtoken');
var config=require('./config');
var FacebookTokenStrategy = require('passport-facebook-token');
var FbStratergy=require('passport-facebook').Strategy;


exports.local=passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// it will create a token and give to us
exports.getToken = user =>{
    return Jwt.sign(user,config.secretKey , {
        expiresIn : 3600
    });
}

var opts={};
// This option specifies how the jsonwebtoken should be extracted from the incoming request message. 
// This is where we will use the extract JWT
// https://stackoverflow.com/questions/36533767/nodejs-jwtstrategy-requires-a-function-to-retrieve-jwt-from-requests-error
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// This is the second parameter which helps me to supply the secret key which
// I'm going to be using within my strategy for the sign-in
opts.secretOrKey= config.secretKey;



/*
    explanation for done parameter in below function
    This done in passport takes three parameters.So, you can see the three pieces of information this 
    done expects it says, error: any. So, if you have an error you will pass it in as the first
    parameter. The second parameter, user?, If a user exists, then the user value will be passed in
    and then if any info?:, any. So, these two are optional parameters and so, if you pass in any 
    information, then that will be used within the application. If I pass in false as the second 
    parameter, then that means that the user doesn't exist or that. So, it'll interpret that the user
    doesn't exist. So, I could say, err, false, because this is an error. So, I'm not going to be 
    passing in a user value there, I'm just going to pass in false. There, the next, we can say,
    else if (user). So, if the user is not null, we'll say return done(null). There is no error 
    so, the first parameter will be null and the second parameter is the user, but we just got from
    the MongoDB. Otherwise, we will return done with null, false. So, in the last case, we could not
    find the user, so we're going to be passing in false
*/


exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    }));


// we will be using it to verify an incoming user and session false indicate we are not using session
// jwt specify the stratergy we are using 
exports.verifyUser = passport.authenticate('jwt',{session : false});

exports.verifyAdmin = (req,res,next)=>{
    console.log("body",req.body);
    console.log("user", req.user);
    console.log("admin flag",req.user.admin);
    if(req.user.admin == true){
        console.log("true condition ");
        next();
    }else{
        err=new Error('You are not authorized to perform this operation!');
        err.status=403;
        return next(err);
    }
  
}

/*
for verifying a user, I will use the JWT strategy. How does the JWT strategy work? In the incoming request,
the token will be included in the authentication header as we saw here. We said authentication header as 
bearer token. If that is included, then that'll be extracted and that will be used to authenticate the user based upon the token
*/


/*
 if the user exists then you will find that user and return the value. If the user doesn't exist you're going to be creating a new user based upon the user's Facebook profile that we obtained. And then add in the new user into our server site, into the database. So this is the strategy that we configure for our passport, the new FacebookTokenStrategy.
*/
/* exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID : '540144854606524',
    clientSecret :'48de4521a95d46bd029fdeab43e25cc7'
    //fbGraphVersion: 'v15.0'
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
)); */


exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (access_token, refresh_token, profile, done) => {
    User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (!err && user !== null) {
            return done(null, user);
        }
        else {
            user = new User({ username: profile.displayName });
            user.facebookId = profile.id;
            user.firstname = profile.name.givenName;
            user.lastname = profile.name.familyName;
            user.save((err, user) => {
                if (err)
                    return done(err, false);
                else
                    return done(null, user);
            })
        }
    });
}
));



exports.test=(req,res,next)=>{
    console.log(req.headers);
    next();
}


/*
passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret,
    fbGraphVersion: 'v3.0'
  }, function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({facebookId: profile.id}, function (error, user) {
      return done(error, user);
    });
  }
)); */