var createError = require('http-errors');
var express = require('express');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var authenticate = require('./authenticate');
var config = require('./config');



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
If the user is logged in, then what happens is that when the session is initiated again, you recall that when 
you log in here, you will be logging in here, and a call to the passport authenticate local, when this is done
at the login stage, the passport authenticate local will automatically add the user property to the
request message. So, it'll add req.user and then, the passport session that we have done here will 
automatically serialize that user information and then store it in the session. So, and subsequently,
whenever a incoming request comes in from the client side with the session cookie already in place,
then this will automatically load the req.user onto the incoming request. So, that is how the passport 
session itself is organized. So, once this is done, even our authentication code will become lot more 
simpler here. So, in the authentication code, we will simply say, if req.user. So, the req.user will 
be loaded in by the passport session middleware automatically, and so we'll say req.user. 
If not req.user we'll say var err, new error, you're not authenticated,
and all these messages here. Otherwise, see the else part also now gets simplified.
*/


app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);

/*
this authentication was applied to every single incoming request. Now, I'm going to change my application, 
whereby I will require authentication only on certain routes and not on all the routes. So, let me remove this authentication completely from app.js

function auth(req,res,next){
  console.log(req.session);

  if(!req.user){
      let err = new Error('user is not authenticated so please authenticate and retry');
      err.status = 403;
      return next(err);
  }else{
    next();
  }
}


app.use(auth);
*/

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);

const moongose = require('mongoose');
const Dishes=require('./models/dishes');

const url=config.mongoUrl;
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
