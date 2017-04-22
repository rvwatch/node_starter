var express = require('express');
var path = require('path');
var BillingUtil = require('../util/billing.js');

module.exports = function (app, passport) {
    var config = app.get('config');
    var log = app.get('log').getLogger("[routes-billing]");
    var billing = new BillingUtil(app);

    //billing.createCustomer(email);
}