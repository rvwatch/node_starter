//TODO should change to router to avoid 'isLoggedIn' call in every chain
module.exports = function (app) {
    var log = app.get('logger');

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('info', "You need to log in to do that.");
        res.redirect('/');
    }

    app.get('/logout',
        isLoggedIn,
        function (req, res) {
            res.cookie("sid", "", { expires: new Date(1) });
            app.get('sessionStore').destroy(req.sessionID);
            req.logout();

            //don't just redirect here, causes cookie to not get cleared
            req.flash('info', "You've logged out.");
            res.render('index');
        }
    );

    app.get('/profile',
        isLoggedIn,
        function (req, res) {
            res.render('profile', {
                user: req.user
            });
        }
    );
};

