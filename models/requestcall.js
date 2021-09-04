'use strict';
module.exports = (sequelize, DataTypes) => {
  const RequestCall = sequelize.define('RequestCall', {
    user_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName       : 'request_calls'
  });
  RequestCall.associate = function(models) {
    // associations can be defined here
  };
  return RequestCall;
};