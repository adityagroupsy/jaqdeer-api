'use strict';
module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', {
    title_en        : DataTypes.STRING,
    title_ar        : DataTypes.STRING,
    city_id         : DataTypes.INTEGER,
    is_publish      : DataTypes.INTEGER
  }, {
    underscored     : true,
    tableName       : 'areas'
  });
  Area.associate = function(models) {
    // associations can be defined here
  };
  return Area;
};