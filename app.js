var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup

var swig = require('swig');
var Swig = new swig.Swig();
swig.setDefaults({ varControls: ['{{%', '%}}'] });
app.engine('html', Swig.renderFile)
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use('/scripts', express.static(__dirname + '/node_modules/angular-dynamic-locale/src/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-cookies/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-translate/dist/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-translate/dist/angular-translate-loader-static-files/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-translate/dist/angular-translate-loader-url/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-translate/dist/angular-translate-storage-local/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-translate/dist/angular-translate-storage-cookie/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-translate-handler-log/'));
app.use('/scripts', express.static(__dirname + '/node_modules/angular-i18n/'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
