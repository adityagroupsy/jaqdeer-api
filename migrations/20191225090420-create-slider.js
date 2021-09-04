'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      object_type :: 
      0 == > None
      1 == > catalog
      2 == > project details
      3 == > All News
      4 == > News Details
      5 == > All Videos
      6 == > Open Video
      7 == > profile
      8 == > Registration
    */
    return queryInterface.createTable('sliders', {
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
      sub_title_en: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sub_title_ar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      external_link: {
        allowNull: true,
        type: Sequelize.STRING
      },
      image_en: {
        allowNull: true,
        type: Sequelize.STRING
      },
      image_ar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      object_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      object_type: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      
      is_publish: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      finished_at: {
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
    },
    {charset: 'utf8',collate: 'utf8_unicode_ci'}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('sliders');
  }
};