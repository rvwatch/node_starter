var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var expressValidator = require('express-validator');
var passport = require('passport');
var session = require('express-session');

//future
var multer = require('multer');
var serveFavicon = require('serve-favicon');

//initialize express
var app = express();
app.use(expressValidator());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.set('views', './client/views');
app.set('view engine', 'ejs');

//set up log4j
var log4js = require('log4js');
log4js.configure({appenders: [{type: 'console'},]});
app.set('logger', log4js.getLogger());
app.get('logger').info("log4js configured");

//redirect morgan to log4js.debug
var morgan = require('morgan');
app.use(morgan("combined", {
    "stream": {
        write: function (str) {
            app.get('logger').debug(str);
        }
    }
}));

//initialize db connection string (using sequelize now)
require('./server/dbconfig.js')(app);

//set up passport
require('./server/passport.js')(app, passport);
app.use(session(require('./server/sessions.js')(app)));
app.use(passport.initialize());
app.use(passport.session());

//routing
require('./server/routing/routes.js')(app, passport);
require('./server/routing/routes-authed.js')(app, passport);

module.exports = app;
