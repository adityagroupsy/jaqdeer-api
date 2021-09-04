'use strict';
module.exports = (sequelize, DataTypes) => {
  const UnitSpecification = sequelize.define('UnitSpecification', {
    project_unit_id: DataTypes.INTEGER,
    title_en: DataTypes.STRING,
    title_ar: DataTypes.STRING,
    dimension_en: DataTypes.STRING,
    dimension_ar: DataTypes.STRING,
    name      : DataTypes.VIRTUAL,
    dimension      : DataTypes.VIRTUAL,
    unit_id: DataTypes.INTEGER,
    project_id: DataTypes.INTEGER

    
  }, {
    underscored: true,
    tableName       : 'unit_specifications'
  });
  UnitSpecification.associate = function(models) {
    // associations can be defined here
    UnitSpecification.belongsTo(models.Unit,  {as: 'specifications', sourceKey: 'id',foreignKey: 'unit_id'});

  };
  return UnitSpecification;
};