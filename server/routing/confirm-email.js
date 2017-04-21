var express = require('express');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

module.exports = function (app, passport) {

    var log = app.get('log').getLogger("[confirm-email]");
    var config = app.get('config');
    var models = require('../models/')(app);
    var mailer = require('../util/mailer')(app);

    app.get('/confirm/:token', function (req, res) {
        async.waterfall([
            function (done) {
                models.User.findOne({
                    where: {
                        confirmToken: req.params.token
                    }
                }).then(function (user) {
                    if (!user) {
                        req.flash('error', 'Your request is invalid or has expired.');
                        return res.redirect('/profile');
                    }

                    user.confirmToken = null;
                    user.confirmed = true;

                    user.save()
                        .then(function (user) {
                            log.info(`${user.email} confirmed email address.`);
                        }).catch(function (err) {
                        log.error(`Confirming email address for ${user.email} FAILED!`);
                        log.error(err);
                        done(err);
                    });

                    done(null, user);
                });
            },
            function (user, done) {
                if (config.mail.confirm.emailOnConfirm) {
                    var mailOptions = {
                        to: user.email,
                        from: config.mail.fromAddress,
                        subject: config.mail.confirm.subject,
                        text: ` Thanks for confirming your address!  Have fun!`
                    };
                    mailer.sendMail(mailOptions, function (err) {
                        req.flash('info', 'Success! Your email address has been confirmed!');
                    });
                }
                done(null);
            }
        ], function (err) {
            if (err) {
                log.warn(`Caught error confirming email address: ${err}`);
                return next(err);
            } else {
                req.flash('info', 'Thanks for confirming your email address!');
                res.redirect('/profile');
            }
        });
    });

    app.get('/reset/:token', function (req, res) {
        models.User.findOne({
            resetToken: req.params.token,
            resetTokenExpires: {$gt: Date.now()}
        }).then(function (user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset', {
                user: req.user,
                token: req.params.token
            });
        });
    });

};