'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    title_en  : DataTypes.STRING,
    title_ar  : DataTypes.STRING,
    code      : DataTypes.STRING,
    is_publish: DataTypes.INTEGER
  }, {
     underscored     : true,
    tableName       : 'cities'
  });
  City.associate = function(models) {
    // associations can be defined here
  };
  return City;
};