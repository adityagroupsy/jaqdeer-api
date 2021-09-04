'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key       : DataTypes.STRING,
    display   : DataTypes.STRING,
    value     : DataTypes.STRING,
    value_ar  : DataTypes.STRING
  }, {
  	underscored: true,
    tableName: 'settings',
  });
  Setting.associate = function(models) {
    // associations can be defined here
  };
  return Setting;
};