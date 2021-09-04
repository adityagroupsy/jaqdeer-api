'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      unit_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      unit_user_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      notes: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      payment_status: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      due_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      amount: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      created_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    },{charset: 'utf8',collate: 'utf8_unicode_ci'});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payments');
  }
};