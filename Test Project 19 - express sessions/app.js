var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter=require('./routes/promoRouter');
var leaderRouter=require('./routes/leaderRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('98765-43210'));

/*
 this session middleware will add this req.session to the request message, 
 so I'm going to do a console log of req.session just to see what it contain

 see auth function for console log of req.session
*/
app.use(session({
  name : 'bhu-session-id',
  secret : '98765-43210',
  saveUninitialized : false,
  resave : false,
  store : new FileStore()
}));



app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req,res,next){
  console.log(req.session);

/*
extending our express REST API server to support a new model for registering and authenticating users. So, we will introduce a new user model and schema into our application. We already have the slash users route which the express generator has already mounted a user's router. So, we're going to leverage that and then update that to support registration of new users, authenticating an existing user, and also logging out a user from our server site
this  code is using models/user.js for userschema
this use routes/users.js  - for signup , login and logout functions
*/


  if(!req.session.user){
      let err = new Error('user is not authenticated so please authenticate and retry');
      err.status = 401;
      return next(err);
  }else if(req.session.user === 'authenticated'){
    next();
  }else{
    let err = new Error('session information is wrong');
    err.status = 403;
    return next(err);
  }

  /*
  Here we are using embedded username and password for authentication of user but in the non commented one 
  we have given user the facility to signup and login through /users

  if(!req.session.user){
    var authHeader = req.headers.authorization;
    if(!authHeader){
      let err = new Error('user is not authenticated so please authenticate and retry');

      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
  }
  var auth =new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
  var username = auth[0];
  var password = auth[1];

    if(username === 'test' && password === 'test'){
      // res.cookie(name , value , option)so it will set  cookie name as user and value as admin
      // res.cookie('user','admin',{ signed : true});
      req.session.user = 'admin';
      next();
    }else{
      let err = new Error('username and password is incorrect');

      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }

  }else{
      if(req.session.user === 'admin'){
        next();
      }else{
        let err = new Error('session information is wrong');
        err.status = 401;
        return next(err);
      }
  }
*/

}


app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

const moongose = require('mongoose');
const Dishes=require('./models/dishes');

const url='mongodb://127.0.0.1:27017/conFusion';
const connect = moongose.connect(url);

connect.then((db)=>{
  console.log('Connected to server successfully');
},(err)=>{
  console.log(err);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
