var express = require('express');
var path = require('path');

module.exports = function (app, passport) {
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('info', "You need to log in to do that.");
        res.redirect('/');
    }

    //moved to routes-authed
    // app.get('/app', (req, res) => {
    //     isLoggedIn,
    //     function (req, res) {
    //         res.sendFile(path.join(__dirname, '../../dist/index.html'));
    //     }
    // });
};
