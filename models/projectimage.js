'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectImage = sequelize.define('ProjectImage', {
    project_id        : DataTypes.INTEGER,
    image             : DataTypes.STRING
  }, {
    underscored       : true,
    tableName         : 'project_images'

  });
  ProjectImage.associate = function(models) {
    // associations can be defined here
  };
  ProjectImage.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if(  values.image )
    {
      values.image = basicPathImage+"projects/" + values.image;
    }else{
      values.image ="";
    }
    return values;
  }
  return ProjectImage;
};