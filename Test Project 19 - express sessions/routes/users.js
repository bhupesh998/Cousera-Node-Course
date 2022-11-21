var express = require('express');
var bodyParser = require('body-parser');
var User = require('../models/user');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


userRouter.post('/signup', function(req,res,next){

  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null) {
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));

/*      User.findOne({  username : req.body.username})
      .then((user)=>{
        if(user !=null ) {
          let  err = new Error('username already exist in database ,please try sigin with passowrd');
          err.status = 403;
          next(err);
        }else{
          return user.create({
            username : req.body.username,
            password : req.body.password 
          });
        }
      })
      .then((user)=>{
        res.statusCode = 201;
        res.setHeader('Content_Type','application/json');
        res.json({
          status: 'Registration done successfully',
          user : user
        });
      },(err)=> next(err))
      .catch((err) => next(err));*/

});

userRouter.post('/login', function(req,res,next){
  
  if(!req.session.user) {
    var authHeader = req.headers.authorization;
    
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    User.findOne({username: username})
    .then((user) => {
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) {
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
      }
    })
    .catch((err) => next(err));
  }
  else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
});


userRouter.get('/logout', (req,res)=>{

  /*
  the session itself provides this method called destroy and when you call the destroy method, the session is destroyed and the information is removed from the server side pertaining to this session. So, which means that if the client tries to again send the session information which is stored in the form of a signed cookie on the client side, that will be invalid. So we need a method of deleting the cookie that is stored on the client side. Now, this operation will remove the session information from the server side so that the session is no longer valid. So, at this point, we'll say req.session.destroy and then we'll say, res.clearCookie. So the clearCookie is a way of asking the client to remove the cookie and the cookie name is the session ID. So, in the previous exercise, we saw that the cookie was stored with the name of session ID on the client side. So we are asking the client to delete this cookie from the client side in the reply message and then we'll say, res.redirect and we'll redirect it to the homepage here.
  */

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
