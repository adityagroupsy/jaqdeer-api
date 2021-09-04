'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title_en        : DataTypes.STRING,
    title_ar        : DataTypes.STRING,
    sub_title_en    : DataTypes.STRING,
    sub_title_ar    : DataTypes.STRING,
    description_en  : DataTypes.TEXT,
    description_ar  : DataTypes.TEXT,
    
    image           : DataTypes.STRING,
    sub_title       : DataTypes.VIRTUAL,
    name            : DataTypes.VIRTUAL,
    is_publish      : DataTypes.INTEGER,
    featured        : DataTypes.INTEGER,
    added_at        : DataTypes.VIRTUAL,
    description     : DataTypes.VIRTUAL,

  }, {
    underscored: true,
    tableName       : 'articles'

  });
  Article.associate = function(models) {
    // associations can be defined here
  };
  Article.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if (! values.sub_title) values.sub_title                    = "";
    if (! values.name) values.name                              = "";
    if(  values.image )
    {
      values.image = basicPathImage+"articles/" + values.image;
    }else{
      values.image ="";
    }
    delete values.created_at;
    delete values.is_publish;
    return values;
  }
  return Article;
};