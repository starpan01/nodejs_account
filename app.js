var createError = require('http-errors');

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');


const session = require('../npm/node_modules/express-session');

const MongoStore = require('../npm/node_modules/connect-mongo');

const { DBhost, DBport, DBname } = require('../mongoose/config');

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');

const accountRouter = require('./routes/account');

const regRouter = require('./routes/reg');

const tokenRouter = require('./routes/token');

var app = express();

app.use(session({
  name: 'sid',
  secret: 'atguigu',
  saveUninitialized: false,
  resave: true,
  store: MongoStore.create({
    mongoUrl: `mongodb://${DBhost}:${DBport}/${DBname}`
  }),
  cookie: {
    httpOnly: true,
    maxAge: 60 * 1000 * 60 * 24 * 7,
  },
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);

app.use('/api', accountRouter);

app.use('/', regRouter);

app.use('/api', tokenRouter);


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
