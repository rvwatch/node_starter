'use strict';
var bcrypt = require("bcrypt");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return [
            queryInterface.bulkInsert('Users',
                [{
                    name: "admin",
                    email: "admin@",
                    role: "admin",
                    billingCustomerId: "cus_AY0NPf8GsVLZMg",
                    billingSubscriptionId: "",
                    password: bcrypt.hashSync("4321", bcrypt.genSaltSync(8), null),
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: "dev",
                    email: "dev@",
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
