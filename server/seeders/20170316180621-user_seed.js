'use strict';
var bcrypt = require("bcrypt");

var dt = new Date();
dt.setDate(dt.getDate() + 30);

var expired = new Date();
expired.setDate(expired.getDate() - 1);

module.exports = {
    up: function (queryInterface, Sequelize) {
        return [
            queryInterface.bulkInsert('Users',
                [{
                    name: "admin",
                    email: "admin@rickdarlington.com",
                    role: "admin",
                    billingCustomerId: "cus_AY3UWlicxSXZwo",
                    billingSubscriptionId: "sub_AY3UDoQQL1p8VV",
                    subscription: 3,
                    confirmed: true,
                    billingPeriodEnd: dt.getTime(),
                    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(8), null),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "confirmed",
                    email: "confirmed@rickdarlington.com",
                    role: "user",
                    billingCustomerId: "cus_confirmed",
                    billingSubscriptionId: "sub_confirmed",
                    subscription: 0,
                    confirmed: true,
                    billingPeriodEnd: dt.getTime(),
                    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(8), null),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "unconfirmed",
                    email: "unconfirmed@rickdarlington.com",
                    role: "user",
                    subscription: 0,
                    confirmed: false,
                    billingPeriodEnd: expired.getTime(),
                    billingEndedAt: expired.getTime(),
                    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(8), null),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }]
            )
        ];
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('User', null, {});
    }
};
