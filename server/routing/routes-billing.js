var async = require('async');
var path = require('path');
var BillingUtil = require('../util/billing.js');

module.exports = function (app, passport) {
    var config = app.get('config');
    var log = app.get('log').getLogger("[routes-billing]");
    var billing = new BillingUtil(app);

    var models = require('../models/')(app);

    app.get('/createBillingCustomer',
        function (req, res) {
            var customer = billing.createCustomer(req.user);
            if(!customer) {
                log.error(`Error creating customer in Stripe for ${req.user.email}`);
            }
            req.flash('info', `${customer.id} created in stripe.`)
            res.redirect("/profile");
        }
    );

    app.get('/customer/:customerId/subscribe/:planId',
        function (req, res) {
            var subscription = billing.subscribeCustomer(req.params.customerId, req.params.planId, req.user.email);
            if (!subscription) {
                log.error(`Error creating subscription in Stripe for ${req.user.email}`);
            }

            res.redirect("/profile");
        }
    );
}