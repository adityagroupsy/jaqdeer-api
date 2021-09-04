'use strict';
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    title_en   : DataTypes.STRING,
    title_ar   : DataTypes.STRING,
    image      : DataTypes.STRING,
    is_publish : DataTypes.INTEGER
  }, {
    underscored: true,
    tableName       : 'services'
  });
  Service.associate = function(models) {
    // associations can be defined here
  };

  Service.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if(  values.image )
    {
      values.image = basicPathImage+"services/" + values.image;
    }else{
      values.image ="";
    }

    delete values.is_publish;
    return values;
  }
  return Service;
};