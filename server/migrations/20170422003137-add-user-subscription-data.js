'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return [
          queryInterface.addColumn(
              'Users',
              'subscription',
              {
                  type: Sequelize.INTEGER,
                  allowNull: false,
                  defaultValue: 0
              }
          ),
          queryInterface.addColumn(
              'Users',
              'billingCustomerId',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.addColumn(
              'Users',
              'billingSubscriptionId',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.addColumn(
              'Users',
              'billingPeriodEnd',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.addColumn(
              'Users',
              'billingEndedAt',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          )

      ];
  },
  down: function (queryInterface, Sequelize) {
      return [
          queryInterface.removeColumn('Users', 'subscription'),
          queryInterface.removeColumn('Users', 'billingCustomerId'),
          queryInterface.removeColumn('Users', 'billingSubscriptionId'),
          queryInterface.removeColumn('Users', 'billingPeriodEnd'),
          queryInterface.removeColumn('Users', 'billingEndedAt')
      ];
  }
};
