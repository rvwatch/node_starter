var express = require('express');

module.exports = function (app, passport) {

    var log = app.get('logger');
    var config = app.get('config');
    var models = require('../models/')(app);

    function setCookies(req, res, next) {
        if (req.isAuthenticated()) {
            if (!req.cookies.jwt_token) {
                var date = new Date();
                date.setDate(date.getDate() + config.sessionExpirationDays);
                res.cookie("jwt_token", req.session.jwtToken, {expires: date});
            }
        }
        return next();
    }

    function redirectIfAuthed(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/profile');
        }
        else {
            return next();
        }
    }

    app.get('/login',
        setCookies,
        redirectIfAuthed,
        function (req, res) {
            res.render('login');
        }
    );

    app.post('/login',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        function (req, res) {
            log.debug("login success");
            res.redirect('/profile');
        }
    );

    app.get('/logout',
        function (req, res) {
            res.cookie("sid", "", {expires: new Date(1)});
            res.cookie("jwt_token", "", {expires: new Date(1)});
            app.get('sessionStore').destroy(req.sessionID);
            req.logout();

            //don't just redirect here, causes cookie to not get cleared
            req.flash('info', "You've logged out.");
            res.render('index');
        }
    );

    app.get('/signup',
        setCookies,
        redirectIfAuthed,
        function (req, res) {
            res.render('signup');
        }
    );

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/',
        setCookies,
        function (req, res) {
            res.render('index');
    });

};
