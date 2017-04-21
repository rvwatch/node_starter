'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            role: {
                allowNull: false,
                type: Sequelize.ENUM('user', 'admin'),
                defaultValue: "user"
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            resetToken: {
                allowNull: true,
                type: Sequelize.STRING
            },
            resetTokenExpires: {
                allowNull: true,
                type: Sequelize.DATE
            },
            confirmToken:  {
                allowNull: true,
                type: Sequelize.STRING
            },
            confirmed: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Users');
    }
};