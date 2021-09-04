'use strict';
module.exports = (sequelize, DataTypes) => {
  /*
      object_type :: 
      0 == > None
      1 == > catalog
      2 == > project details
      3 == > All News
      4 == > News Details
      5 == > All Videos
      6 == > Open Video
      7 == > profile
      8 == > Registration
    */
  const Slider = sequelize.define('Slider', {
    object_id                   : DataTypes.INTEGER,
    object_type                 : DataTypes.INTEGER,
    image_en                    : DataTypes.STRING,
    image_ar                    : DataTypes.STRING,
    title_en                    : DataTypes.STRING,
    title_ar                    : DataTypes.STRING,
    sub_title_en                : DataTypes.STRING,
    sub_title_ar                : DataTypes.STRING,
    external_link               : DataTypes.STRING,
    is_publish                  : DataTypes.INTEGER,
    title                       : DataTypes.VIRTUAL,
    sub_title                   : DataTypes.VIRTUAL,
    image                       : DataTypes.VIRTUAL,
    finished_at                 : DataTypes.DATE
  }, {
    underscored                 : true,
    tableName                   : 'sliders'
  });
  Slider.associate = function(models) {
    // associations can be defined here
  };

  Slider.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    
    if(  values.image )
    {
      values.image = basicPathImage+"sliders/" + values.image;
    }else{
      values.image ="";
    }
    if (! values.title) values.title                              = "";
    if (! values.sub_title) values.sub_title                      = "";
    if (! values.external_link) values.external_link              = "";
    if (! values.object_id) values.object_id              = 0;

    return values;
  }

  return Slider;
};