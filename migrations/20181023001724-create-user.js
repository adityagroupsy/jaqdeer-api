'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      last_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      first_name: {
        allowNull: true,
        type: Sequelize.STRING
      },
      customer_code: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      mobile: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_verify: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      address: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      lang: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_block: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    },
    {charset: 'utf8',collate: 'utf8_unicode_ci'}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};