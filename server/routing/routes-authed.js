module.exports = function (app, passport) {
    var log = app.get('logger');

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            log.info("next()");
            return next();
        }
        res.redirect('/');
    }

    app.get('/logout', function (req, res) {
            //TODO these should be deleted directly, destroy isn't working...
            app.get('sessionStore').destroy(req.sessionID);
            res.clearCookie('sid', { path: '/' });
        res.redirect('/');
    });

    app.get('/profile',
        isLoggedIn,
        function(req, res) {
            res.render('profile', {
                user: req.user
            });
        }
    );
};

