var express = require('express');

module.exports = function (app, passport) {
    var log = app.get('logger');

    app.get('/login', function (req, res) {
        res.render('login', {message: req.flash('error')});
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/', function (req, res) {
        res.render('index');
    });
};
