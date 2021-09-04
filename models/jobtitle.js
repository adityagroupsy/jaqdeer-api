'use strict';
module.exports = (sequelize, DataTypes) => {
  const JobTitle = sequelize.define('JobTitle', {
    title_en        : DataTypes.STRING,
    title_ar        : DataTypes.STRING,
    code            : DataTypes.STRING,
    is_publish      : DataTypes.INTEGER
  }, {
    underscored     : true,
    tableName       :'job_titles',
  });
  JobTitle.associate = function(models) {
    // associations can be defined here
  };
  return JobTitle;
};