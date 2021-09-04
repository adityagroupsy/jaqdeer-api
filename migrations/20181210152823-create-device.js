'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('devices', {
      id: {
        allowNull       : false,
        autoIncrement   : true,
        primaryKey      : true,
        type            :  Sequelize.INTEGER
      },
      device_id: {
        allowNull       : true,
        type            :  Sequelize.STRING
      },
      register_token: {
        allowNull       : true,
        type            :  Sequelize.STRING
      },
      user_id: {
        allowNull       : true,
        type            : Sequelize.INTEGER,
      },
      //for user_model ==2 provider and  user_model ==1 normal user
      user_model: {
        allowNull        : true,
        type             : Sequelize.INTEGER
      },
      version: {
        allowNull       : true,
        type            :  Sequelize.STRING
      },
      platform: {
        allowNull       : true,
        type            :  Sequelize.STRING
      },
      status: {
        allowNull       : true,
        type            :  Sequelize.INTEGER
      },
      created_at: {
        allowNull       : true,
        type            :  Sequelize.DATE
      },
      updated_at: {
        allowNull       : true,
        type            :  Sequelize.DATE
      }
    },
    {charset: 'utf8',collate: 'utf8_unicode_ci'}

    );
  },
  
  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('devices');
  }
};