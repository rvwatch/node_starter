var express = require('express');

module.exports = function (app, passport) {

    var log = app.get('logger');
    var config = app.get('config');
    var models = require('../models/')(app);

    app.get('/login', function (req, res) {
        res.render('login', {message: req.flash('error')});
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        })
    );

    app.get('/signup', function (req, res) {
        res.render('signup', {message: req.flash('error')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/', function (req, res) {
        res.render('index', {message: req.flash('info')});
    });

};
