'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    title_en: DataTypes.STRING,
    title_ar: DataTypes.STRING,
    code: DataTypes.STRING,
    is_publish: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName :'subjects',
  });
  Subject.associate = function(models) {
    // associations can be defined here
  };
  return Subject;
};