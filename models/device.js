'use strict';
const { Op }        = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    device_id       : DataTypes.STRING,
    register_token  : DataTypes.STRING,
    user_id         : DataTypes.INTEGER,
    user_model      : DataTypes.INTEGER,
    version         : DataTypes.STRING,
    platform        : DataTypes.STRING,
    status          : DataTypes.INTEGER
  }, {
    underscored     : true,
    tableName       : 'devices'
  });
  Device.associate = function(models) {
    // associations can be defined here
  };
  return Device;
};