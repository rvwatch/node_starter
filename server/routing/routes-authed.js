var path = require('path');
var dateformat = require('dateformat');

module.exports = function (app) {
    var log = app.get('log').getLogger("[routes-authed]");
    var models = require('../models/')(app);
    var config = app.get('config');

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            if(!req.cookies.jwt_token) {
                var date = new Date();
                date.setDate(date.getDate() + config.sessionExpirationDays);
                res.cookie("jwt_token", req.session.jwtToken, {expires: date});
            }

            return next();
        }
        req.flash('info', "You need to log in to do that.");
        res.redirect('/login');
    }

    function redirectNoPlan(req, res, next) {
        log.trace("billing ends:" + req.user.billingEndedAt);
        log.trace("current: " + new Date().getTime()/1000);
        log.trace("current: " + new Date().getTime());

        if(req.user.billingSubscriptionId == null ||
            (req.user.billingEndedAt != null && req.user.billingEndedAt < (new Date().getTime()/1000))) {
            res.redirect("/pickaplan");
        }
        else {
            return next();
        }
    }

    function confirmEmailPrompt(req, res, next) {
        log.trace("confirmed: " + req.user.confirmed);
        if(!req.user.confirmed) {
            req.flash('info',"Please check your email and click the link to confirm your address.");
        }
        return next();
    }

    app.post('/profile/update',
        isLoggedIn,
        redirectNoPlan,
        confirmEmailPrompt,
        function(req, res) {
            req.user.name = req.body.name;

            req.user.save()
                .then(function (user) {
                    req.flash('info', `Profile information updated.`);
                    res.redirect("/profile");
                }).catch(function (err) {
                    req.flash('info', `Unable to update profile, please try again.`);
                    res.redirect("/profile");
            });
        }
    );

    app.get('/profile',
        isLoggedIn,
        redirectNoPlan,
        confirmEmailPrompt,
        function (req, res) {
            var planEnd = null;
            if(req.user.billingEndedAt) {
                planEnd = dateformat(new Date(req.user.billingEndedAt * 1000), "dddd, mmmm dS, yyyy");
            }
            res.render('profile', {
                user: req.user,
                //full date format "dddd, mmmm dS, yyyy, h:MM:ss TT"
                periodEnd: dateformat(new Date(req.user.billingPeriodEnd * 1000), "dddd, mmmm dS, yyyy"),
                planType: req.user.planType(),
                planStatus: req.user.planStatus(),
                planEnd: planEnd
            });
        }
    );

    app.post('/profile/password/update',
        isLoggedIn,
        redirectNoPlan,
        confirmEmailPrompt,
        function(req, res) {
            if(!req.user.validPassword(req.body.password)) {
                req.flash('error', `Wrong password.`);
                res.redirect("/profile");
            }
            else if ( req.body.newpassword == null || req.body.newpassword == "" ) {
                //TODO extended validation?
                req.flash('error', `Please pick a better password.`);
                res.redirect("/profile");
            }
            else {
                req.user.password = models.User.hash(req.body.newpassword);
                req.user.save()
                    .then(function (user) {
                        req.flash('info', `Password updated.`);
                        res.redirect("/profile");
                    }).catch(function (err) {
                    req.flash('error', `Unable to update password, please try again.`);
                    res.redirect("/profile");
                });
            }
        }
    );
};

