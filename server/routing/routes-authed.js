module.exports = function (app, passport) {
    var log = app.get('logger');

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/',
            failureFlash: true
        })
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

