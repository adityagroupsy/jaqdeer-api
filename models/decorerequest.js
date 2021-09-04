'use strict';

module.exports = (sequelize, DataTypes) => {

  const DecoreRequest = sequelize.define('DecoreRequest', {
    user_id: DataTypes.INTEGER,

    status: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName       : 'decore_requests'
    
  });
  DecoreRequest.associate = function(models) {
    // associations can be defined here
  };
  return DecoreRequest;
};