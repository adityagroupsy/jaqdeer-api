'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('verify_codes', {
      id: {
        allowNull         : false,
        autoIncrement     : true,
        primaryKey        : true,
        type              : Sequelize.INTEGER
      },
      code: {
        allowNull         : true,
        type              : Sequelize.STRING
      },
      is_used: {
        allowNull         : true,
        type              : Sequelize.BOOLEAN
      },
      invalid_date: {
        allowNull         : true,
        type              : Sequelize.DATE
      },
      //for provider and normal user 
      user_id: {
        allowNull         : true,
        type              : Sequelize.INTEGER
      },
          //for user_model ==2 provider and  user_model ==1 normal user

      user_model: {
        allowNull         : true,
        type              : Sequelize.INTEGER
      },
      //for type ==1 verify account and  type ==2 forgot password
      type: {
        allowNull         : true,
        type              : Sequelize.INTEGER
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
    return queryInterface.dropTable('verify_codes');
  }
};