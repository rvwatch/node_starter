var path = require('path');

//TODO should change to router to avoid 'isLoggedIn' call in every chain
module.exports = function (app) {
    var log = app.get('logger');

    function isLoggedIn(req, res, next) {
        console.log("login check: " + req.isAuthenticated());
        if (req.isAuthenticated()) {
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

