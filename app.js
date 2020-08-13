const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const parseurl = require('parseurl');
const logger = require('morgan');
const session = require('express-session');
const SQLiteStore = require('connect-better-sqlite3')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const docsTreeRouter = require('./routes/docsTree');
const getDocRouter = require('./routes/getDoc');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const store = new SQLiteStore({
  //secret: 'foo bar',
  //secure: true
});

//app.use(store);

/*app.use(
    session({
        store: store(),
        secret: 'keyboard cat',
        resave: false,
    })
);*/
app.use(session({
    store: store,
    secret: 'your secret',
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
}));

app.use(function (req, res, next) {
    if (!req.session.views) {
        req.session.views = {}
    }

    // get the url pathname
    const pathname = parseurl(req).pathname;

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

    next()
});

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
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
