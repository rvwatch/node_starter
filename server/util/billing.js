var app;
var log;
var stripe;
var config;

function BillingUtil(app) {
    this.app = app;

    log = app.get('log').getLogger("[util/billing]");
    config = app.get('config');
    stripe = require('stripe')(config.stripe.secret);
}

BillingUtil.prototype.createCustomer = function(user) {
        stripe.customers.create(
        {email: user.email},
        function (err, customer) {
            if(err) {
                log.error(`Error creating billing customer (${email}) in stripe: ${err}`);
                return null;
            }
            log.info(`Billing customer (${user.email}) created in Stripe`);

            user.billingCustomerId = customer.id;

            user.save()
                .then(function (user) {
                    log.info(`Billing info updated for ${user.email}, stripe id: ${customer.id}`);
                    return customer;
                }).catch(function (err) {
                    log.error(err);
                });

            return customer;
        }
    );
}

BillingUtil.prototype.subscribeCustomer = function(billingCustomerId, planId, email) {
    stripe.subscriptions.create({
        customer: billingCustomerId,
        plan: planId,
        trial_period_days: 7
    }, function(err, subscription) {
        if (err) {
            log.error(`Error creating subscription for customer ${email} : ${err}`);
            return null;
        }
        log.info(`Subscription for customer (${email}) created in Stripe`);
        return subscription;
    });
};

module.exports = BillingUtil;