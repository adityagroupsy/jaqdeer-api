'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('projects', {
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
      description_en: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      description_ar: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_publish: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      is_featured: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      progress_status: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      latitude: {
        allowNull: true,
        type: Sequelize.STRING
      },
      longitude: {
        allowNull: true,
        type: Sequelize.STRING
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING
      },
      city_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      area_id: {
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
    {charset: 'utf8',collate: 'utf8_unicode_ci'});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('projects');
  }
};