var express = require('express');

module.exports = function (app, passport) {
    var log = app.get('log').getLogger("[apiv1]");
    var config = app.get('config');
    var models = require('../../models/')(app);

    function userMatches(req, res, next) {
        if (req.isAuthenticated() && req.params.email == req.user.email) {
            return next();
        }
        req.flash('info', "You need to log in to do that.");

        res.status(404).json();
    }

    app.get('/api/v1/user/:email',
        passport.authenticate('jwt', {session: false}),
        userMatches,
        function (req, res) {
            models.User.findOne({
                where: {
                    email: req.params.email
                }
            }).then(function (user) {
                if (!user) {
                    //you better not have gotten here!
                    res.json("");
                }

                res.json(user.sanitize());
            });
        }
    );

};