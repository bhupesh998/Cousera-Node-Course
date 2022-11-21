var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


userRouter.post('/signup', function(req,res,next){

  User.register(new User({username: req.body.username}),req.body.password,(err,user)=>{
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
});

userRouter.post('/login',passport.authenticate('local'),(req,res)=>{
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success:true,status: 'U R NOW LOGGED IN '});
});


userRouter.get('/logout', (req,res)=>{

  if(req.session){
    req.session.destroy();
    res.clearCookie('bhu-session-id');
    res.redirect('/');
  }else{
    var err = new Error('Please login to your account to logout');
    err.status = 403;
    next(err);
  }

});

module.exports = userRouter;
