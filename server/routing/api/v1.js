var express = require('express');
var async = require('async');
var path = require('path');

module.exports = function (app, passport) {
    var log = app.get('log').getLogger("[apiv1]");
    var config = app.get('config');
    var models = require('../../models/')(app);
    var stripe = require('stripe')(config.stripe.secret);
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
                    res.json("error");
                }

                res.json(user.sanitize());
            });
        }
    );

    app.post('/subscription/:planId/subscribe',
        function (req, res) {
            async.waterfall([
                function(done) {
                    stripe.customers.create(
                        {email: req.user.email},
                        function (err, customer) {
                            if(err) {
                                log.error(`Error creating billing customer (${email}) in stripe: ${err}`);
                                done(err);
                            }
                            log.info(`Billing customer (${req.user.email}) created in Stripe`);

                            req.user.billingCustomerId = customer.id;

                            req.user.save()
                                .then(function (user) {
                                    log.info(`Billing info updated for ${user.email}, stripe id: ${customer.id}`);
                                    return customer;
                                }).catch(function (err) {
                                log.error(err);
                                done(err);
                            });
                            done(null, customer);
                        })
                },
                function(customer, done) {
                    stripe.subscriptions.create({
                        customer: customer.id,
                        plan: req.params.planId,
                        trial_period_days: config.trialPeriodDays
                    }, function(err, subscription) {
                        if (err) {
                            log.error(`Error creating subscription for customer ${req.user.email} : ${err}`);
                            done(err);
                        }
                        log.info(`Subscription (${req.params.planId}) for customer (${req.user.email}) created in Stripe`);

                        req.user.billingSubscriptionId = subscription.id;

                        req.user.save()
                            .then(function (user) {
                                log.info(`Billing info updated for ${user.email}, subscription id: ${subscription.id}`);
                                return customer;
                            }).catch(function (err) {
                            log.error(err);
                            done(err);
                        });

                        done(null, customer, subscription);
                    });
                }

            ], function (err, customer) {
                if (err) {
                    log.error(`Failed to subscribe user ${req.user.email} to plan ${req.params.planId}`);
                    log.error(err);
                    res.json("error");
                }
                res.json(customer);
            });
        }
    );
};