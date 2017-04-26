var express = require('express');
var async = require('async');
var path = require('path');

module.exports = function (app, passport) {
    var log = app.get('log').getLogger("[apiv1]");
    var config = app.get('config');
    var models = require('../../models/')(app);
    var stripe = require('stripe')(config.stripe.secret);
    var models = require('../../models/')(app);

    function authorized(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(401).json({"error": "unauthorized"});
    }

    function validPlanId(req, res, next) {
        if (req.params.planId == 1 || req.params.planId == 2 || req.user.role == "admin") {
            return next();
        }
        else {
            res.status(404).json({"error": "planId not found"});
        }
    }

    function userMatchesOrAdmin(req, res, next) {
        if ((req.isAuthenticated() && req.params.email == req.user.email) ||
            (req.isAuthenticated() && req.user.role == "admin")) {
            return next();
        }

        res.status(401).json({"error": "unauthorized"});
    }

    function userNotSubscribed(req, res, next) {
        if (req.user.billingSubscriptionId != null) {
            res.status(400).json({"error": `user is already subscribed to plan (${req.user.billingSubscriptionId})`});
        } else {
            return next();
        }
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

    app.get('/api/v1/plans/:planId/subscribe',
        authorized,
        validPlanId,
        userNotSubscribed,
        function (req, res) {
            async.waterfall([
                function (done) {
                    if (req.user.billingCustomerId != null) {
                        log.warn(`Customer ${req.user.email} already has a stripe customerId`);
                        stripe.customers.retrieve(
                            req.user.billingCustomerId,
                            function (err, customer) {
                                if (err) {
                                    done(err);
                                }
                                else {
                                    done(null, customer);
                                }
                            }
                        );
                    } else {
                        stripe.customers.create(
                            {email: req.user.email},
                            function (err, customer) {
                                if (err) {
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
                    }
                },
                function (customer, done) {
                    if (req.user.billingSubscriptionId != null) {
                        log.warn(`Customer ${req.user.email} already has a stripe subscriptionId`);

                        stripe.subscriptions.retrieve(
                            req.user.billingSubscriptionId,
                            function (err, subscription) {
                                if (err) {
                                    log.error(err);
                                    done(err);
                                } else {
                                    done(null, customer, subscription);
                                }
                            }
                        );
                    } else {
                        stripe.subscriptions.create({
                            customer: customer.id,
                            plan: req.params.planId,
                            trial_period_days: config.trialPeriodDays
                        }, function (err, subscription) {
                            if (err) {
                                log.error(`Error creating subscription for customer ${req.user.email} : ${err}`);
                                done(err);
                            } else {
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
                            }
                        });
                    }
                }
            ], function (err, customer, subscription) {
                if (err) {
                    log.error(`Failed to subscribe user ${req.user.email} to plan ${req.params.planId}`);
                    log.error(err);
                    if (err.raw) {
                        res.json(`error: ${err.raw.message}`);
                    }
                    else {
                        res.json(`error ${err}`);
                    }

                }
                else {
                    res.json(customer);
                }
            });
        }
    );
};