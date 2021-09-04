'use strict';
const date          = require('date-and-time');
module.exports = (sequelize, DataTypes) => {
  const VerifyCode = sequelize.define('VerifyCode', {
    code                : DataTypes.STRING,
    is_used             : DataTypes.BOOLEAN,
    user_model          : DataTypes.INTEGER,
    invalid_date        : DataTypes.DATE,
    invalid_at          : DataTypes.STRING,
    user_id             : DataTypes.INTEGER,
    type                : DataTypes.INTEGER
  }, {
    underscored         : true,
    tableName           : 'verify_codes'
  });
  VerifyCode.associate = function(models) {
    // associations can be defined here
  };

//user_model = 1 for user 2 for provider
//type 1 for verify account 2 for forgot password


VerifyCode.new_code     = (user_id,user_model,type,code) => {
    return new Promise((resolve, reject) => {
      let invalid_date = new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Cairo'
      });

      var d                   = new Date();
      var local               = d.getTime();
      var offset              = d.getTimezoneOffset() * (60 * 1000);
      var utc                 = new Date(local + offset);
      var cairoNow             = new Date(utc.getTime() + (2 * 60 * 60 * 1000));
      cairoNow                 = date.format(new Date(cairoNow),'YYYY-MM-DD h:m:s');
      VerifyCode.create({
        code            : code,
        user_model      : user_model,
        is_used         : 0,
        user_id         : user_id,
        type            : type,
        invalid_date    : new Date(),
        invalid_at      :  (new Date(cairoNow).getTime() )+ 15*60000,
      }).then(code_generated => {
        
        resolve(code_generated)

      }).catch(error => {console.log(error.message);resolve(error.message)});   

    }).catch(error => {console.log(error.message);resolve(error.message)});   
}; 
  return VerifyCode;
};