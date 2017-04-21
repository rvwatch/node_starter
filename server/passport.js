var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

var jwt = require('jsonwebtoken');
var passportJWT = require("passport-jwt");
var JwtStrategy = passportJWT.Strategy;

module.exports = function (app, passport) {
    var pool = app.get('pool');
    var log = app.get('log').getLogger("[passport]");
    var config = app.get('config');
    var models = require('./models/')(app);
    var mailer = require('./util/mailer')(app);

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
                    bcrypt.compare(password, user.password).then(function (result) {
                        if (result) {
                            log.info(`${user.name} (${user.id}) logged in.`);

                            req.session.jwtToken = jwt.sign({id: user.id}, config.jwtSecret);

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
            if (!email) {
                return done(null, false, req.flash('error', 'Email is required.'));
            }

            if (!password) {
                return done(null, false, req.flash('error', 'Password is required.'));
            }

            if (!req.body.name || req.body.name == null || req.body.name == "") {
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
                    async.waterfall([
                        function (done) {
                            crypto.randomBytes(36, function (err, buf) {
                                var token = buf.toString('hex');
                                done(err, token);
                            });
                        },
                        function (token, done) {
                            models.User
                                .findOrCreate({
                                    where: {
                                        name: req.body.name,
                                        email: email,
                                        password: models.User.hash(password),
                                        confirmToken: token
                                    }
                                })
                                .spread(function(user, created) {
                                    if (!user) {
                                        done("Error creating user in DB");
                                    } else {
                                        done(null, token, user);
                                    }
                                });
                        },
                        function (token, user, done) {
                            var confirmLink = config.mail.fromDomain + '/confirm/' + token;

                            var mailOptions = {
                                to: email,
                                from: config.mail.fromAddress,
                                subject: config.mail.confirm.subject,
                                confirmLink: confirmLink,
                                text: 'Use this link to confirm your email address: ' + confirmLink
                            };

                            mailer.sendMail({
                                mailOptions
                            }, (err, info) => {
                                log.debug(`Sending ${info.messageId} to ${email}`);
                                log.debug(`Confirm link: ${mailOptions.confirmLink}`);
                                log.debug(info.message.toString());
                                req.flash('info', 'Thanks for Registering!  Please check your email and click the link to confirm your address.');
                                done(err, user);
                            });
                        },
                        function(user, done) {
                            req.logIn(user, function(err) {
                                if (err) {
                                    done(err);
                                }
                            });
                            req.session.jwtToken = jwt.sign({id: user.id}, config.jwtSecret);
                            done(null);
                        }
                    ], function (err) {
                        if (err) {
                            log.warn(`Caught error registering user: ${err}`);
                            req.flash("Sorry, we couldn't handle that!  Please log in again.");
                        }

                        return done(err);
                    });
                }
            });
        }));

    passport.use(new JwtStrategy(app.get("jwtOptions"), function (jwt_payload, next) {
        log.debug('payload received', jwt_payload);

        models.User.findOne({
            where: {
                id: jwt_payload.id
            }
        }).then(function (user) {
            if (!user) {
                log.debug(`jwt failed for user: ${user.email}`);
                next(null, false);
            } else {
                log.debug(`jwt success for user: ${user.email}`);
                next(null, user);
            }
        });
    }));
};
