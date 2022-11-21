var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate  = require('../authenticate');
const cors=require('./cors');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

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
userRouter.post('/login',cors.corsWithOptions,passport.authenticate('local'),(req,res)=>{
  var token = authenticate.getToken({
    _id : req.user._id
  });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true,token : token,status: 'U R NOW LOGGED IN '});
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

module.exports = userRouter;
