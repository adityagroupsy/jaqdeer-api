'use strict';
module.exports = (sequelize, DataTypes) => {
  const PageTitle = sequelize.define('PageTitle', {
    page_id           : DataTypes.INTEGER,
    key               : DataTypes.STRING,
    title_en          : DataTypes.STRING,
    name              : DataTypes.VIRTUAL,

    title_ar          : DataTypes.STRING
  }, {
    underscored       : true,
    tableName         : 'page_titles'

  });
  PageTitle.associate = function(models) {
    // associations can be defined here
  };
  return PageTitle;
};