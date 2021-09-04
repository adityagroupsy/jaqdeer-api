'use strict';
module.exports = (sequelize, DataTypes) => {
  const Shoowroom = sequelize.define('Shoowroom', {
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    address_en: DataTypes.STRING,
    address_ar: DataTypes.STRING,
    city_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName       : 'shoowrooms'

  });
  Shoowroom.associate = function(models) {
    // associations can be defined here
    Shoowroom.belongsTo(models.City,  {as: 'city', sourceKey: 'id',foreignKey: 'city_id'});
  };
  return Shoowroom;
};