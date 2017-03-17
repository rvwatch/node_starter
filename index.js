var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var serveFavicon = require('serve-favicon');
var session = require('express-session');
var flash = require('express-flash');
var expressValidator = require('express-validator');
var multer = require('multer');
var passport = require('passport');
var morgan = require('morgan');

//initialize express
var app = express();
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(flash());
app.set('views', './client/views');
app.set('view engine', 'ejs');

//initialize postgres
var pg = require('pg');
var pool = require('./server/dbconfig.js')(app, pg)
app.set('pool', pool);

var models = require('./server/models/')(app);

models.sequelize
    .authenticate()
    .catch(function (error) {
        console.log("Error creating DB connection:", error);
    });

//set up sessions/cookies for passport
require('./server/passport.js')(app, models, passport);
var sess = require('./server/sessions.js')(app);
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

require('./server/routes.js')(app, passport);
require('./server/authroutes.js')(app, passport);

module.exports = app;
