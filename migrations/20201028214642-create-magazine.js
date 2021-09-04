'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('magazines', {
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
      file: {
        allowNull: true,
        type: Sequelize.STRING
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_publish: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: true,
        type: Sequelize.DATE
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
    return queryInterface.dropTable('magazines');
  }
};