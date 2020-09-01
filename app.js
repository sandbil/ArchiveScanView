const createError = require('http-errors');
const express = require('express');
const path = require('path');
const morgan  = require('morgan');
const cfg = require('./lib/config');
const winston = require('./lib/winstonCfg');
const session = require('express-session');

const SQLiteStore = require('connect-better-sqlite3')(session);


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const docsTreeRouter = require('./routes/docsTree');
const getDocRouter = require('./routes/getDoc');
const loginSSORouter = require('./routes/loginSSORouter');
const app = express();

const store = new SQLiteStore(cfg.sqlite3db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


morgan.token('date', function(){ return new Date().toString()});
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    store: store,
    resave: false,
    saveUninitialized: true,
    secret: cfg.session_secret,
    cookie: { maxAge: cfg.sessionMaxAge} // 1 week
  })
);


app.use('/', indexRouter);
app.use('/loginsso', loginSSORouter);
app.use('/users', usersRouter);
app.use('/docstree', docsTreeRouter);
app.use('/getdoc', getDocRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = 'Oops an error occurred!';
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  winston.error(`${err.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
