module.exports = function (app, passport) {
    var log = app.get('logger');

    function logRoute(req, res, next) {
        next();
    }

    app.get('/login', function (req, res) {
        res.render('login', {message: req.flash('error')});
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/login',
        [logRoute],
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
};
