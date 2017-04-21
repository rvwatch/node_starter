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

const cors = require('cors');

//initialize express
var app = express();
app.set('env', process.env.NODE_ENV || 'development');
app.set('config', require(__dirname + '/server/config.json')[app.get('env')]);
app.set('views', './client/views');
app.set('view engine', 'ejs');
app.use(expressValidator());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.use(cors());

//set up log4j
var log4js = require('log4js');
log4js.configure({appenders: [{type: 'console'}, ], replaceConsole: true});
app.set('log', log4js);
app.get('log').getLogger("[server]").info("log4js configured");

//redirect morgan to log4js.debug
var morgan = require('morgan');
app.use(morgan("combined", {
    "stream": {
        write: function (str) {
            app.get('log').getLogger("[morgan]").debug(str);
        }
    }
}));

//initialize db connection strings only
require('./server/dbconfig.js')(app);

//initialize JWT
require('./server/jwtconfig.js')(app);

//set up passport
require('./server/passport.js')(app, passport);
app.use(session(require('./server/sessions.js')(app)));
app.use(passport.initialize());
app.use(passport.session());

//static includes
app.use(express.static(__dirname + '/public'));

//include angular 2 client
app.use(express.static(__dirname + '/dist'));

//pass request object to all templates
app.use(function(req, res, next) {
    res.locals.req = req;
    next();
});

//routing
require('./server/routing/forgot-password.js')(app, passport);
require('./server/routing/confirm-email.js')(app, passport);
require('./server/routing/routes-authed.js')(app, passport);
require('./server/routing/routes.js')(app, passport);
require('./server/routing/api/v1.js')(app, passport);

module.exports = app;
