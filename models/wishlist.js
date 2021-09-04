'use strict';
module.exports = (sequelize, DataTypes) => {
  const WishList = sequelize.define('WishList', {
    object_id     : DataTypes.INTEGER,
    object_type   : DataTypes.INTEGER,
    user_id       : DataTypes.INTEGER
  }, {
    underscored   : true,
    tableName     : 'wish_lists',
  });
  WishList.associate = function(models) {
    // associations can be defined here
  };

  WishList.getIsFavorits = (project_id,user,type) => {
  return new Promise((resolve, reject) => {
  
      if( user == null || project_id == null){
        resolve(0);
      }else{
        WishList.count({
          where : {object_id :project_id ,object_type:type, user_id: user.id  }
        }).then( is_favorite_project => {

          if (is_favorite_project > 0) {
            resolve(1) ;

          }else{
            resolve(0);

          }
        });
      }
  });
};


return WishList;
};