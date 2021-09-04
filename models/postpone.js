'use strict';
module.exports = (sequelize, DataTypes) => {
  const Postpone = sequelize.define('Postpone', {
      user_id: DataTypes.INTEGER,
      postpone_at: DataTypes.STRING,
      status: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName         : 'postpones'
  });
  Postpone.associate = function(models) {
    // associations can be defined here
  };
  return Postpone;
};