'use strict';
module.exports = (sequelize, DataTypes) => {
  const CustomerCode = sequelize.define('CustomerCode', {
    code: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    is_publish: DataTypes.INTEGER,
    is_used: DataTypes.INTEGER,
    used_at: DataTypes.DATE
  }, {
    underscored: true,
    tableName :'customer_codes',

  });
  CustomerCode.associate = function(models) {
    // associations can be defined here
  };
  return CustomerCode;
};