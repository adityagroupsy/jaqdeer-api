'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id: {
        allowNull        : false,
        autoIncrement    : true,
        primaryKey       : true,
        type             : Sequelize.INTEGER
      },
      title: {
        allowNull        : true,
        type             : Sequelize.STRING
      },
      message: {
        allowNull        : true,
        type             : Sequelize.TEXT
      },
      //for provider and normal user 
      user_id: {
        allowNull        : true,
        type             : Sequelize.INTEGER
      },
      //for user_model ==2 provider and  user_model ==1 normal user 
      user_model: {
        allowNull        : true,
        type             : Sequelize.INTEGER
      },

      is_read: {
        allowNull        : true,
        type             : Sequelize.BOOLEAN
      },

      read_at: {
        allowNull        : true,
        type             : Sequelize.DATE
      },
      //for oders and offers id 
      object_id: {
        allowNull        : true,
        type             : Sequelize.INTEGER
      },
      //type of notifications
      type: {
        allowNull        : true,
        type             : Sequelize.INTEGER
      },
      created_at: {
        allowNull        : true,
        type             : Sequelize.DATE
      },
      updated_at: {
        allowNull        : true,
        type             : Sequelize.DATE
      }
    },
      {charset: 'utf8',collate: 'utf8_unicode_ci'}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifications');
  }
};