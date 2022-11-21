var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate  = require('../authenticate');
const cors=require('./cors');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options('*',cors.corsWithOptions , (req,res)=>{
  res.sendStatus(200);
})
/* GET users listing. */
userRouter.get('/', cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
    .then((users)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(users);
    },(err)=> next(err))
    .catch((err)=>{
        next(err);
    });
});


userRouter.post('/signup', cors.corsWithOptions,function(req,res,next){

  User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err : err});
    }else{
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err,user)=>{
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err : err});
        }else{
          passport.authenticate('local')(req,res,()=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success:true,status: 'Registration Successful!'});
          });
        }
      });
  }
  });
});


//https://stackoverflow.com/questions/72447729/login-sessions-require-session-support-did-you-forget-to-use-express-session
// above link gives solution to the err when i was making request to login endpoint
// changed passport version from "passport": "^0.6.0" to "passport": "^0.4.0"
userRouter.post('/login',cors.corsWithOptions,(req,res,next)=>{

  /*
  Reviewing this code one more time. So we'll do router post, but instead of doing passport authenticate right there, we will say req, res, next and then inside here we will do a passport.authenticate for the local. And this authenticate will pass back, so we can supply a callback function to that. And this callback function will return either the error, the user, or the info here. And so, if it does an error we'll just allow the express error handler to take care of that. If the user is null then that means that the user logon was unsuccessful, and the reason for that will be in the info so that will pass back as the info error in the plan message here. If we come up to this point then the user is successfully verified. So then we will login the user. So the passport.authenticate will add in this method called logIn to the request message, so we can call the login with the user and if this returns an error, then we will return the error here appropriately. If not then we would have reached the point where the user is successfully authenticated so they can generate the JSON web token here and return the JSON web token to the user to confirm that the user is successfully logged.
  */

  passport.authenticate('local',(err,user,info)=>{

    if(err) return next(err);
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:false,status: 'LOGIN unsucessful ',err:info});
    }

    req.logIn(user,(err)=>{
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success:false,status: 'LOGIN unsucessful ',err:'could not login a user'});
      }

      var token = authenticate.getToken({
        _id : req.user._id
      });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:true,token : token,status: 'U R NOW LOGGED IN '});
    });

  })(req,res,next);
 
});

userRouter.get('/logout', (req,res)=>{

  if(req.session){
    req.session.destroy();
    res.clearCookie('bhu-session-id');
    res.redirect('/');
  }else{
    var err = new Error('Please login to your account to logout');
    err.status = 403;
    return next(err);
  }

});


userRouter.get('/facebook/token',passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

/* userRouter.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    // do something with req.user
    res.send(req.user? 200 : 401);
  }
); */

/*
 It is quite possible that while the client has logged in and obtained the JSON web token, sometime later, the JSON Web Token may expire. And so if the user tries to access from the client side with an expired token to the server then the server will not be able to authenticate the user. So at periodic intervals we may wish to cross check to make sure that the JSON web token is still valid. So that is the reason why I am including another endpoint called checkJWTToken, so if you do a get to the checkJWTToken. By including the token into the authorization header, then this call will return a true or false to indicate to you whether the JSON web token is still valid or not. If it is not valid then the client side can initiate another login for For the user to obtain a new JSON web token, if required
*/

userRouter.get('/checkJWTToken',cors.corsWithOptions,(req,res)=>{
  passport.authenticate('jwt',{session : false},(err,user,info)=>{
    if(err) return next(err);
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:false,status: 'JWT INVALID', err:info});
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:true,status: 'JWT IS VALID ',user:user});
    }


  })(req,res);
})
module.exports = userRouter;
