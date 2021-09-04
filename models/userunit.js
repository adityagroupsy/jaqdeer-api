'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserUnit = sequelize.define('UserUnit', {
    user_id           : DataTypes.INTEGER,
    project_id        : DataTypes.INTEGER,
    project_unit_id   : DataTypes.INTEGER,
    started_at        : DataTypes.DATE,
    status            : DataTypes.INTEGER,
    down_payment      : DataTypes.FLOAT,
    total_price       : DataTypes.FLOAT,
    no_month          : DataTypes.INTEGER,
    remain_payment    : DataTypes.VIRTUAL,
  }, {
    underscored       : true,
    tableName         : 'user_units'

  });
  UserUnit.associate = function(models) {
    // associations can be defined here
    UserUnit.belongsTo(models.ProjectUnit,  {as: 'project_unit', sourceKey: 'id',foreignKey: 'project_unit_id'});
    UserUnit.belongsTo(models.Unit,  {as: 'unit', sourceKey: 'id',foreignKey: 'unit_id'});
    UserUnit.belongsTo(models.Project,  {as: 'project', sourceKey: 'id',foreignKey: 'project_id'});
    
  };
  UserUnit.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if (! values.total_price) values.total_price                          = 0.0;
    if (! values.down_payment) values.down_payment                        = 0.0;
    if (! values.remain_payment) values.remain_payment                    = 0.0;
    if (! values.no_month) values.no_month                                = 0;
    
   
    return values;
  }

  return UserUnit;
};