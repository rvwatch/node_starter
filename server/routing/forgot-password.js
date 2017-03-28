var express = require('express');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

module.exports = function (app, passport) {

    var log = app.get('logger');
    var config = app.get('config');
    var models = require('../models/')(app);
    var mailer = require('../util/mailer')(app);

    app.post('/forgot', function (req, res, next) {
        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buf) {
                    var token = buf.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                models.User.findOne({
                    where: {
                        email: req.body.email
                    }
                }).then(function (user) {
                    if (!user) {
                        req.flash('info', 'Please check your email for password reset instructions.');
                        return res.redirect('/forgot');
                    }

                    user.resetToken = token;
                    user.resetTokenExpires= Date.now() + 3600000; // 1 hour

                    user.save()
                    .then(function(user) {
                        log.info(`Password reset requested for ${user.email}`);
                    }).catch(function(err) {
                        log.error(`Password reset for ${user.email} FAILED!`);
                        log.error(err);
                        req.flash('error', 'Something went wrong, please try again later.');
                        return res.redirect('/forgot');
                    })

                    done(null, token, user);
                });
            },
            function (token, user, done) {
                var resetLink = config.mail.reset.fromDomain + '/reset/' + token;

                var mailOptions = {
                    to: user.email,
                    from: config.mail.reset.fromAddress,
                    subject: config.mail.reset.subject,
                    resetLink: resetLink,
                    text: 'Use this link to reset your password: ' + resetLink
                };

                mailer.sendMail({
                    mailOptions
                }, (err, info) => {
                    log.debug(`Sending ${info.messageId} to ${user.email}`);
                    log.debug(`Reset link: ${mailOptions.resetLink}`);
                    log.debug(info.message.toString());
                    req.flash('info', 'Please check your email for password reset instructions.');
                    done(err, next);
                });
            }
        ], function (err) {
            if (err) {
                log.warn(`Caught error in forgot password: ${err}`);
                return next(err);
            }
            res.redirect('/forgot');
        });
    });

    app.post('/reset', function(req, res) {
        async.waterfall([
            function(done) {
                models.User.findOne({
                    where: {
                        resetToken: req.body.token,
                        resetTokenExpires:  { $gt: Date.now() }
                    }
                }).then(function (user) {
                    if (!user) {
                        req.flash('error', 'Password reset token is invalid or has expired.');
                        return res.redirect('/forgot');
                    }

                    if(req.body.newPassword != req.body.confirmPassword) {
                        req.flash('error', 'Passwords must match!');
                        res.render('reset', {
                            token: req.body.token,
                            info: req.flash('info'),
                            error: req.flash('error')
                        });
                        return;
                    }

                    user.password = models.User.hash(req.body.newPassword);
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save()
                        .then(function(user) {
                            log.info(`Updating password for ${user.email}.`);
                        }).catch(function(err) {
                            log.error(`Updating password for ${user.email} FAILED!`);
                            log.error(err);
                            done(err);
                        });

                    done(null, user);
                });
            },
            function(user, done) {
                var mailOptions = {
                    to: user.email,
                    from: config.mail.reset.fromAddress,
                    subject: config.mail.reset.subject,
                    text: `The password for ${user.email} has been updated.  If you did not request this change, please let us know!`
                };
                mailer.sendMail(mailOptions, function(err) {
                    req.flash('info', 'Success! Your password has been changed.  Please log in again!');
                    done(err);
                });
            }
        ], function(err) {
            res.redirect('/');
        });
    });

    app.get('/reset/:token', function(req, res) {
        models.User.findOne({
            resetToken: req.params.token,
            resetTokenExpires:  { $gt: Date.now() }
        }).then(function (user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user,
                token: req.params.token,
                info: req.flash('info'),
                error: req.flash('error')
            });
        });
    });

    app.get('/forgot', function(req, res) {
        res.render('forgot', {
            info: req.flash('info'),
            error: req.flash('error')
        });
    });
};