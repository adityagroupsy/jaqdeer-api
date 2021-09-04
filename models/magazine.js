'use strict';
module.exports = (sequelize, DataTypes) => {
  const Magazine = sequelize.define('Magazine', {
    title_en        : DataTypes.STRING,
    title_ar        : DataTypes.STRING,
    file            : DataTypes.STRING,
    image            : DataTypes.STRING,
    is_publish      : DataTypes.INTEGER,
    date           : DataTypes.DATE,
  }, {
    underscored     : true,
    tableName       : 'magazines'
  });
  Magazine.associate = function(models) {
    // associations can be defined here
  };



    Magazine.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if(  values.image )
    {
      values.image = basicPathImage+"magazines/images/" + values.image;
    }else{
      values.image ="";
    }
    if(  values.file )
    {
      values.file = basicPathImage+"magazines/pdfs/" + values.file;
    }else{
      values.file ="";
    }
    delete values.created_at;
    delete values.is_publish;
    return values;
  }
  return Magazine;
};