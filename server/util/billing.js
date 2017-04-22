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

BillingUtil.prototype.createCustomer = function(email) {
    stripe.customers.create(
        {email: email},
        function (err, customer) {
            if(err) {
                log.error(`Error creating billing customer (${email}) in stripe: ${err}`);
            }
            log.info(`Billing customer (${email}) created in Stripe`);
            return customer;
        }
    );
}

module.exports = BillingUtil;