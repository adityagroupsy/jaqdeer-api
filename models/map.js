'use strict';
module.exports = (sequelize, DataTypes) => {

  const Map               = sequelize.define('Map', {
    title_en              : DataTypes.STRING,
    title_ar              : DataTypes.STRING,
    image_en              : DataTypes.STRING,
    image_ar              : DataTypes.STRING,
    is_publish            : DataTypes.INTEGER,
    name                  : DataTypes.VIRTUAL,
    image                 : DataTypes.VIRTUAL,


  }, {
    underscored           : true,
    tableName             : 'maps'
  });

  Map.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if (! values.name) values.name                              = "";
    if(  values.image )
    {
      values.image = basicPathImage+"maps/" + values.image;
    }else{
      values.image ="";
    }
   
    return values;
  }


  return Map;
};