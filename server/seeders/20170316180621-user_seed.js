'use strict';
var bcrypt = require("bcrypt");

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
                    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(8), null),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "dev",
                    email: "dev@rickdarlington.com",
                    role: "user",
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
