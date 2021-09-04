'use strict';
const date          = require('date-and-time');
module.exports = (sequelize, DataTypes) => {

  /*
  user_model :: 1 for normal user
  user_model :: 2 for provider
  */
  const Notification = sequelize.define('Notification', {
    title             : DataTypes.STRING,
    message           : DataTypes.TEXT,
    object_id         : DataTypes.INTEGER,
    type              : DataTypes.INTEGER,
    user_id           : DataTypes.INTEGER,
    user_model        : DataTypes.INTEGER,
    is_read           : DataTypes.BOOLEAN,
    created_at        : DataTypes.VIRTUAL,
    read_at           : DataTypes.DATE
  }, {
    underscored       : true,
    tableName         : 'notifications'

  });
  Notification.associate = function(models) {
    // associations can be defined here
  };
  Notification.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if (! values.is_read){ values.is_read          = 0 }else{ values.is_read          = 1 ;} 
    if (! values.object_id) values.object_id      = 0;
    if (! values.title) values.title              = "";
    if (! values.message) values.message          = "";
    delete values.user_id;
    delete values.user_model;
    delete values.read_at;
    delete values.updatedAt;
    delete values.createdAt;
    return values;
  }
  return Notification;
};