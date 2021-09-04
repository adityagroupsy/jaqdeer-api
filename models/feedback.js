'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    name        : DataTypes.STRING,
    mobile      : DataTypes.STRING,
    email       : DataTypes.STRING,
    subject     : DataTypes.STRING,
    message     : DataTypes.TEXT,
    object_id   : DataTypes.INTEGER,
    object_type : DataTypes.INTEGER,
    status      : DataTypes.INTEGER
  }, {
    underscored     : true,
    tableName       : 'feedbacks'

  });
  Feedback.associate = function(models) {
    // associations can be defined here
  };
  return Feedback;
};