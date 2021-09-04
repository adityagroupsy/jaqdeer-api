'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProjectService = sequelize.define('ProjectService', {
    project_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER
  }, {
    underscored     : true,
    tableName       : 'project_services'
  });
  ProjectService.associate = function(models) {
    // associations can be defined here
  };
  return ProjectService;
};