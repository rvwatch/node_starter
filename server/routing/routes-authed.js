var path = require('path');

//TODO should change to router to avoid 'isLoggedIn' call in every chain
module.exports = function (app) {
    var log = app.get('logger');

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

    app.get('/profile',
        isLoggedIn,
        function (req, res) {
            res.render('profile', {
                user: req.user
            });
        }
    );
};

