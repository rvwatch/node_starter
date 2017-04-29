var path = require('path');

module.exports = function (app) {
    var log = app.get('log').getLogger("[routes-authed]");

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
        log.trace(req.user.billingEndedAt);
        log.trace(new Date().getTime());

        if(req.user.billingSubscriptionId == null ||
            (req.user.billingEndedAt != null && req.user.billingEndedAt < new Date().getTime())) {
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

    app.get('/profile',
        isLoggedIn,
        redirectNoPlan,
        confirmEmailPrompt,
        function (req, res) {
            res.render('profile', {
                user: req.user
            });
        }
    );
};

