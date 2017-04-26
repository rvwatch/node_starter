var async = require('async');
var path = require('path');

module.exports = function (app, passport) {

    var log = app.get('log').getLogger("[routes-billing]");
    var config = app.get('config');
    var stripe = require('stripe')(config.stripe.secret);

    function authorized(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error', "Please log in to do that.");
        res.redirect("/");
    }

    function validPlanId(req, res, next) {
        if (req.params.planId == 1 || req.params.planId == 2 || req.user.role == "admin") {
            return next();
        }
        else {
            req.flash('error', "Something went wrong.  Please try again later.");
            redirect("/profile");
        }
    }

    function userNotSubscribed(req, res, next) {
        if (req.user.billingSubscriptionId != null) {
            log.warn(`user is already subscribed to plan (${req.user.billingSubscriptionId})`);
            req.flash('info', "You are already subscribed.  Let us know if you are having issues, thanks!");
            res.redirect("/profile");
        } else {
            return next();
        }
    }

    function redirectHasPlan(req, res, next) {
        if (req.user.billingSubscriptionId != null) {
            res.redirect("/profile");
        }
        else {
            return next();
        }
    }

    app.get('/pickaplan',
        authorized,
        redirectHasPlan,
        function (req, res) {
            res.render('pickaplan', {
                user: req.user,
                config: config
            });
        }
    );

    app.post('/billing/plans/:planId/subscribe',
        authorized,
        validPlanId,
        userNotSubscribed,
        function (req, res) {
            if (req.user.billingCustomerId != null && req.user.billingSubscriptionId != null) {
                log.warn(`Customer ${req.user.email} already has a stripe customerId`);
                req.flash('info', 'Thanks, but you already have a subscription!');
                res.redirect("/profile");
            } else {
                stripe.customers.create(
                    {
                        email: req.body.stripeEmail,
                        source: req.body.stripeToken,
                        plan: req.params.planId
                    },
                    function (err, customer) {
                        if (err) {
                            log.error(`Error creating billing customer (${email}) in stripe: ${err}`);
                            req.flash('info', "Sorry we had a problem setting up your subscription.  Please try again later.");
                            res.redirect("/profile");
                        }
                        log.info(`Billing customer (${req.user.email}) created in Stripe`);

                        req.user.billingCustomerId = customer.id;
                        req.user.billingSubscriptionId = customer.subscriptions.data[0].id;

                        req.user.save()
                            .then(function (user) {
                                log.info(`Billing info updated for ${user.email}, stripe customer id: ${user.billingCustomerId}, Stripe subscription id: ${user.billingSubscriptionId}`);
                                req.flash('info', "Thanks for Subscribing!");
                                res.redirect("/profile");
                            }).catch(function (err) {
                                log.error(err);
                                req.flash('error', "Sorry we had a problem setting up your subscription.  Please try again later.");
                                res.redirect("/profile");
                        });
                    })
            }
        }
    );

    app.post('/billing/plans/:planId/createandsubscribe',
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
                            plan: req.params.planId
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
                                        done(null, customer, subscription);
                                    }).catch(function (err) {
                                    log.error(err);
                                    done(err);
                                });
                            }
                        });
                    }
                }
            ], function (err, customer, subscription) {
                if (err) {
                    log.error(`Failed to subscribe user ${req.user.email} to plan ${req.params.planId}`);

                    if (err.raw) {
                        log.error(`Stripe error: ${err.raw.message}`);
                        req.flash("info", "Thanks for subscribing!");
                        res.redirect("/profile");
                    }
                    else {
                        log.error(`Billing error: ${err}`);
                        req.flash('error', "Something went wrong.  Please try again later.");
                        res.redirect("/profile");
                    }
                }
                else {
                    req.flash("info", "Thanks for subscribing!");
                    log.info(`${req.user.email} subscribed as ${customer.id} to plan ${subscription.id} in Stripe.`);
                    res.redirect("/profile");
                }
            });
        }
    );
}