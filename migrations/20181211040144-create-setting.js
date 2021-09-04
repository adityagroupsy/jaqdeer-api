'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('settings', {
      id: {
        allowNull         : false,
        autoIncrement     : true,
        primaryKey        : true,
        type              : Sequelize.INTEGER
      },
      key: {
        allowNull         : true,
        type              : Sequelize.STRING
      },
      display: {
        allowNull         : true,
        type              : Sequelize.STRING
      },
      value: {
        allowNull         : true,
        type              : Sequelize.STRING
      },
      value_ar: {
        allowNull         : true,
        type              : Sequelize.STRING
      },
      created_at: {
        allowNull         : true,
        type              : Sequelize.DATE
      },
      updated_at: {
        allowNull         : true,
        type              : Sequelize.DATE
      }
    },
      {charset: 'utf8',collate: 'utf8_unicode_ci'}
    

    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('settings');
  }
};