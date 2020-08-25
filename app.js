const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
//const parseurl = require('parseurl');
const morgan  = require('morgan');
const cfg = require('./lib/config');
const winston = require('./lib/winstonCfg');
const session = require('express-session');
const {sso} = require('node-expose-sspi');

const SQLiteStore = require('connect-better-sqlite3')(session);


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const docsTreeRouter = require('./routes/docsTree');
const getDocRouter = require('./routes/getDoc');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

morgan.token('date', function(){ return new Date().toString()});
app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const store = new SQLiteStore(cfg.sqlite3db);

app.use(session({
    store: store,
    resave: false,
    saveUninitialized: false,
    secret: cfg.session_secret,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

app.use(function (req, res, next) {
    if (!req.session.user) {
        console.log('!req.session.user');
        const domain = sso.getDefaultDomain();
        console.log('domain:',domain );
        next();
    } else {
        console.log('next("route")');
        next("route");
    };
}, sso.auth(), function (req, res, next) {
    console.log('after sso');
    if (!req.sso) {
        //return res.redirect('/protected/welcome');
    } else
        req.session.user = req.sso.user;
    console.log(req.session.user.displayName);
    next();
});

/*app.use(sso.auth(),(req, res,next) =>  {
    console.log ('req.sso:',req.sso);
    if (!req.sso) {
        req.session.user = ''
    } else
        req.session.user = req.sso.user;
    //return res.redirect('/protected/welcome');
    next();
});*/

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/docstree', docsTreeRouter);
app.use('/getdoc', getDocRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.app.get('env'));
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = 'Oops an error occurred!';
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  winston.error(`${err.status || 500} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
