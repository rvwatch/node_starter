var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");
var bodyParser = require('body-parser')

module.exports = function (app, passport) {
    var pool = app.get('pool');
    var log = app.get('logger');

    var models = require('./models/')(app);

    passport.serializeUser(function (user, done) {
        log.debug(`serialize user: ${user.id}`)
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        log.debug(`deserialize user: ${id}`)
        models.User.findById(id)
            .then(function (user) {
                done(null, user);
            });
    });

    passport.use('local', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            log.debug("local login request");
            models.User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (!user) {
                    log.info(`${email} tried to log in, we don't know them.`);
                    //more descriptive or more "secure"
                    return done(null, false, {message: 'Wrong user name or password!'});
                }
                else {
                    bcrypt.compare(password, user.password).then(function (res) {
                        if (res) {
                            log.info(`${user.name} (${user.id}) logged in.`);
                            return done(null, user);
                        }
                        else {
                            return done(null, false, {message: 'Wrong user name or password!'});
                        }
                    });
                }
            });
        }));

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            //validate
            if(!email) {
                return done(null, false, req.flash('error', 'Email is required.'));
            }

            if(!password) {
                return done(null, false, req.flash('error', 'Password is required.'));
            }

            if(!req.body.name || req.body.name == null || req.body.name == "") {
                return done(null, false, req.flash('error', 'Name is required.'));
            }

            models.User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (user) {
                    return done(null, false, req.flash('error', 'That email is already taken.'));
                } else {
                    models.User
                        .findOrCreate({where: {name: req.body.name, email: email, password: models.User.hash(password)}})
                        .spread(function(user, created) {
                            log.info(`${email} registered`);
                            done(null, user);
                        });
                }
            });
    }));
};
