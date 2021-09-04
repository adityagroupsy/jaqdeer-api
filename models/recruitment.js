'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recruitment = sequelize.define('Recruitment', {
    object_id         : DataTypes.INTEGER,
    name              : DataTypes.STRING,
    mobile            : DataTypes.STRING,
    cv_file           : DataTypes.STRING,
    status            : DataTypes.INTEGER,
    email             : DataTypes.STRING,
    job_id            : DataTypes.INTEGER
  }, {
    underscored       : true,
    tableName         : 'recruitments'
  });
  Recruitment.associate = function(models) {
    // associations can be defined here
  };
  return Recruitment;
};