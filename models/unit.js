'use strict';
module.exports = (sequelize, DataTypes) => {
  let UnitSpecification       = sequelize.import('../models/unitspecification');
  
  const Unit = sequelize.define('Unit', {
    title_en              : DataTypes.STRING,
    title_ar              : DataTypes.STRING,
    image                 : DataTypes.STRING,
    area                  : DataTypes.STRING,
    project_id            : DataTypes.INTEGER,
    is_publish            : DataTypes.INTEGER,
    name                  : DataTypes.VIRTUAL,
    is_favorite           : DataTypes.VIRTUAL,
    specification_image   : DataTypes.STRING,
    object_type           : DataTypes.VIRTUAL,
    object_id             : DataTypes.VIRTUAL,
    project_title         : DataTypes.VIRTUAL,



  }, {
    underscored: true,
    tableName       : 'units'
  });

  Unit.associate = function(models) {
    Unit.hasMany(models.UnitSpecification,  {as: 'specifications', sourceKey: 'id',foreignKey: 'unit_id'});
    
  };

  Unit.getUnitData     = (unit_id,language_code) => {
  
    return new Promise((resolve, reject) => {
     Unit.findOne({  
        where:{
          id  : unit_id,
          is_publish  : 1,

        },
        attributes:[
         ['title_'+language_code, 'name'],'id','image','is_favorite','project_id','object_id','object_type','project_title','specification_image','area',
        ],
        include : [{
          model: UnitSpecification,
          as :"specifications",
          attributes:[
             ['title_'+language_code, 'name'],
             ['dimension_'+language_code, 'dimension'],
          ],
          
        }],
     }).then(unit=>{

        resolve(unit)
      
     })
    })

  };

  Unit.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if (! values.name) values.name                              = "";
    if (! values.progress_percentage) values.progress_percentage      = 0;

    if(  values.image )
    {
      values.image = basicPathImage+"units/" + values.image;
    }else{
      values.image ="";
    }
    if(  values.specification_image )
    {
      values.specification_image = basicPathImage+"units/" + values.specification_image;
    }else{
      values.specification_image ="";
    }

    if (! values.area) values.area      = "";
    return values;
  }


  return Unit;
};