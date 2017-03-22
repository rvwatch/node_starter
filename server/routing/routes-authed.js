module.exports = function (app) {
    var log = app.get('logger');

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }

    app.get('/logout',
        isLoggedIn,
        function(req, res) {
            app.get('sessionStore').destroy(req.sessionID);
            res.clearCookie('sid', {path: '/'});
            res.redirect('/');
        }
    );

    app.get('/profile',
        isLoggedIn,
        function(req, res) {
            res.render('profile', {
                user: req.user
            });
        }
    );
};

