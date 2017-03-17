'use strict';
var bcrypt = require("bcrypt");

module.exports = {
    up: function (queryInterface, Sequelize) {
        return [
            queryInterface.bulkInsert('Users', [
                {
                    name: "dev",
                    email: "dev@",
                    password: bcrypt.hashSync("1234", bcrypt.genSaltSync(8), null),
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ])
        ];
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('User', null, {});
    }
};
