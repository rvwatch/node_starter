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
          )
      ];
  },
  down: function (queryInterface, Sequelize) {
      return [
          queryInterface.removeColumn('Users', 'subscription'),
          queryInterface.removeColumn('Users', 'billingCustomerId')
      ];
  }
};
