'use strict';
module.exports = (sequelize, DataTypes) => {
  const DecoreType = sequelize.define('DecoreType', {
    title_en: DataTypes.STRING,
    title_ar: DataTypes.STRING,
    price: DataTypes.FLOAT,
    is_publish: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName :'decore_types',
  });
  DecoreType.associate = function(models) {
    // associations can be defined here
  };
  return DecoreType;
};