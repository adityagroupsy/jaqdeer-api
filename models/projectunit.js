'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectUnit = sequelize.define('ProjectUnit', {
    unit_id : DataTypes.INTEGER,
    image   : DataTypes.STRING,
    project_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName       : 'project_units'
  });
  ProjectUnit.associate = function(models) {
    // associations can be defined here
    ProjectUnit.hasMany(models.UnitSpecification,  {as: 'specifications', sourceKey: 'id',foreignKey: 'project_unit_id'});
    
  };

  ProjectUnit.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());

    if(  values.image )
    {
      values.image = basicPathImage+"units/" + values.image;
    }else{
      values.image ="";
    }
    return values;
  }
  return ProjectUnit;
};