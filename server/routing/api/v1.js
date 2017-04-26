var express = require('express');
var async = require('async');
var path = require('path');

module.exports = function (app, passport) {
    var log = app.get('log').getLogger("[apiv1]");
    var config = app.get('config');
    var stripe = require('stripe')(config.stripe.secret);
    var models = require('../../models/')(app);

    function userMatchesOrAdmin(req, res, next) {
        if ((req.isAuthenticated() && req.params.email == req.user.email) ||
            (req.isAuthenticated() && req.user.role == "admin")) {
            return next();
        }

        res.status(401).json({"error": "unauthorized"});
    }

    function userMatches(req, res, next) {
        if (req.isAuthenticated() && req.params.email == req.user.email) {
            return next();
        }

        res.status(401).json({"error": "unauthorized"});
    }

    function isAdminUser(req, res, next) {
        if (req.isAuthenticated() && req.user.role == "admin") {
            return next();
        }

        res.status(401).json({"error": "unauthorized"});
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
                    res.json("error");
                }

                res.json(user.sanitize());
            });
        }
    );

    app.get('/api/v1/plans/:planId/subscribers',
        isAdminUser,
        function (req, res) {
            stripe.subscriptions.list({
                plan: req.params.planId,
            }, function (err, subscriptions) {
                if (err) {
                    res.status(500).json();
                }
                else {
                    res.json(subscriptions);
                }
            });
        }
    );
};