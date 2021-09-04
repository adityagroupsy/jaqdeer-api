'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('unit_specifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_unit_id: {
        allowNull: true,
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
      dimension_en: {
        allowNull: true,
        type: Sequelize.STRING
      },
      dimension_ar: {
        allowNull: true,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('unit_specifications');
  }
};