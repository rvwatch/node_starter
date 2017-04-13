var express = require('express');

module.exports = function (app, passport) {
    var log = app.get('logger');
    var config = app.get('config');
    var models = require('../../models/')(app);

    app.get('/api/v1/user/:email', function (req, res) {

        models.User.findOne({
            where: {
                email: req.params.email
            }
        }).then(function (user) {
            if (!user) {
                res.send("not found");
            }

            res.json(user.sanitize());
        });
    });

};