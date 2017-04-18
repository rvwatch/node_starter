var express = require('express');

module.exports = function (app, passport) {

    var log = app.get('logger');
    var config = app.get('config');
    var models = require('../models/')(app);

    function redirectIfAuthed(req, res, next) {
        if (req.isAuthenticated()) {
            req.flash('info', "Welcome back!");
            res.redirect('/profile');
        }
        else {
            return next();
        }
    }

    app.get('/login',
        redirectIfAuthed,
        function(req, res) {
            res.render('login');
        }
    );

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    app.get('/logout',
        function (req, res) {
            res.cookie("sid", "", { expires: new Date(1) });
            app.get('sessionStore').destroy(req.sessionID);
            req.logout();

            //don't just redirect here, causes cookie to not get cleared
            req.flash('info', "You've logged out.");
            res.render('index');
        }
    );

    app.get('/signup',
        redirectIfAuthed,
        function (req, res) {
            res.render('signup');
        }
    );

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/home', function (req, res) {
        res.render('home', {req: req});
    });

    app.get('/', function (req, res) {
        res.render('home', {req: req});
    });

};
