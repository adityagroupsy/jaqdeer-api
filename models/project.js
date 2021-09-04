'use strict';
const { Op }        = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  let ProjectImage            = sequelize.import('../models/projectimage');
  let ProjectService          = sequelize.import('../models/projectservice');
  let Service                 = sequelize.import('../models/service');
  let ProjectUnit             = sequelize.import('../models/projectunit');
  let Unit                    = sequelize.import('../models/unit');
  let UnitSpecification       = sequelize.import('../models/unitspecification');


  const Project = sequelize.define('Project', {
    title_en                    : DataTypes.STRING,
    title_ar                    : DataTypes.STRING,
    description_en              : DataTypes.TEXT,
    description_ar              : DataTypes.TEXT,
    image_en                    : DataTypes.STRING,
    image_ar                    : DataTypes.STRING,
    image                       : DataTypes.VIRTUAL,
    is_publish                  : DataTypes.INTEGER,
    is_featured                 : DataTypes.INTEGER,
    progress_status             : DataTypes.INTEGER,
    status                      : DataTypes.INTEGER,
    latitude                    : DataTypes.STRING,
    longitude                   : DataTypes.STRING,
    address                     : DataTypes.STRING,
    city_id                     : DataTypes.INTEGER,
    area_id                     : DataTypes.INTEGER,
    services                    : DataTypes.VIRTUAL,
    units                       : DataTypes.VIRTUAL,
    progress_text_en            : DataTypes.STRING,
    progress_text_ar            : DataTypes.STRING,
    progress_text               : DataTypes.VIRTUAL,
    images                      : DataTypes.VIRTUAL,
    name                        : DataTypes.VIRTUAL,
    description                 : DataTypes.VIRTUAL,
    is_favorite                 : DataTypes.VIRTUAL,
    object_id                   : DataTypes.VIRTUAL,
    object_type                 : DataTypes.VIRTUAL,
    project_title               : DataTypes.VIRTUAL,
    
  }, {
    underscored       : true,
    tableName         : 'projects'

  });
  Project.associate = function(models) {
    // associations can be defined here
    //Project.hasMany(models.Service,  {as: 'interests', sourceKey: 'id',foreignKey: 'chat_id'});
    Project.belongsTo(models.City,  {as: 'city', sourceKey: 'id',foreignKey: 'city_id'});
    Project.belongsTo(models.Area,  {as: 'area', sourceKey: 'id',foreignKey: 'area_id'});
    Unit.hasMany(models.UnitSpecification,  {as: 'specifications', sourceKey: 'id',foreignKey: 'unit_id'});
  };

  /* check if user that logged is favorite product or not*/


Project.getProductData     = (project_id,language_code) => {
  
    return new Promise((resolve, reject) => {
     Project.findOne({  
        where:{
          id  : project_id,
          is_publish  : 1,

        },
        attributes:[
         ['title_'+language_code, 'name'],'id',['image_'+language_code, 'image'],'is_favorite','object_id','object_type'
        ],
     }).then(unit=>{

      resolve(unit)
     })
    })

  };


  Project.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if(  values.image )
    {
      values.image = basicPathImage+"projects/" + values.image;
    }else{
      values.image ="";
    }
    if (! values.progress_percentage) values.progress_percentage      = 0;
    if (! values.is_favorite) values.is_favorite                      = 0;

    if (! values.progress_text) values.progress_text                  = "";
    if (! values.description) values.description                      = "";
    if (! values.name) values.name                                    = "";
    if (! values.latitude) values.latitude                            = "0";
    if (! values.longitude) values.longitude                          = "0";

    delete values.is_featured;
    delete values.is_publish;
    delete values.is_featured;
    return values;
  }

  Project.get_project_data = (project_id,language_code) => {
    return new Promise((resolve, reject) => {
      ProjectImage.findAll({
        where : {project_id :project_id }
      }).then( project_images => {
        let data        = [];
        data['services']   = [];
        data['images']     = [];
        if (project_images) {
          const images =  project_images.map(function(item){
            return basicPathImage+"projects/" +item['image'];
          });
          data['images']     = images;
        }
        ProjectService.findAll({
          where : {project_id :project_id }
        }).then( project_services => {
          if(project_services.length > 0){
            const ids =  project_services.map(function(item){
              return item['service_id'];
            });
            Service.findAll({
              where : { id : { [Op.in] : ids} },
              attributes:[
               ['title_'+language_code, 'name'],'id','image'
              ],
            }).then( project_services => {
                data['services']     = project_services;
                
            });
          }
          Unit.findAll({
            where : { project_id :project_id},
            attributes:[
             ['title_'+language_code, 'name'],'id','image','specification_image','area'
            ],
            include : [{
              model: UnitSpecification,
              as :"specifications",
              attributes:[
                 ['title_'+language_code, 'name'],
                 ['dimension_'+language_code, 'dimension'],
              ],
              
            }],
          }).then( units => {

            //
            units.forEach( user_unit => {
            if (language_code == 'ar') {
                  if (! user_unit.area){ user_unit.area      = "" }else{ user_unit.area = (user_unit.area ).toArabicDigits()}
              }else{

                  if (! user_unit.area){ user_unit.area      = "" }
              }
          })
              data['units']     = units;
              resolve(data);
          });
        });
      });
    });
  };

  return Project;
};