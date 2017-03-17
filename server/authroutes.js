module.exports = function (app, passport) {
    function logRoute(req, res, next) {
        console.log(`${req.body.email}`);
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
