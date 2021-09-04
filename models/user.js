'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {


    customer_code           : DataTypes.STRING,
    last_name               : DataTypes.STRING,
    first_name              : DataTypes.STRING,
    email                   : DataTypes.STRING,
    mobile                  : DataTypes.STRING,
    is_verify               : DataTypes.INTEGER,
    image                   : DataTypes.STRING,
    password                : DataTypes.STRING,
    address                 : DataTypes.TEXT,
    lang                    : DataTypes.INTEGER,
    is_block                : DataTypes.INTEGER,
    token                   : DataTypes.VIRTUAL,
    is_registered           : DataTypes.INTEGER,
    points                  : DataTypes.STRING,


  }, {
    underscored     : true,
    tableName       : 'users'
  });
  User.associate = function(models) {
    // associations can be defined here
  };

   //override tojson fn.
  User.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());
    if(  values.image )
    {
      values.image = basicPathImage+"users/" + values.image;
    }else{
      values.image ="";
    }
    if( ! values.email ){
      values.email = "";
    }
    if( ! values.mobile ){
      values.mobile = "";
    }
    if( ! values.address ){
      values.address = "";
    }
    delete values.updatedAt;
    delete values.createdAt;

    delete values.is_registered;
    if (! values.points) values.points                              = "0";
    if (! values.is_block) values.is_block                          = 0;
    
    delete values.password;
    delete values.is_verify;
    return values;
  }
  User.hashPassword     = (password) => {
    const bcrypt        = require('bcryptjs');
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, function(err, hash) {
        if (err) reject(err);
          else {
          resolve(hash);
        }
      });
    })
};
  return User;
};