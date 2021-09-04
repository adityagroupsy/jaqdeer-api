'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('decore_types', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title_en: {
        allowNull: true,
        type: Sequelize.STRING
      },
      title_ar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      price: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      is_publish: {
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
    return queryInterface.dropTable('decore_types');
  }
};