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
        res.redirect('/');
    }

    function redirectNoPlan(req, res, next) {
        if(req.user.billingSubscriptionId == null) {
            res.redirect("/pickaplan");
        }
        else {
            return next();
        }
    }

    app.get('/profile',
        isLoggedIn,
        redirectNoPlan,
        function (req, res) {
            res.render('profile', {
                user: req.user
            });
        }
    );
};

