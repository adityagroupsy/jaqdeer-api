'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    user_id           : DataTypes.INTEGER,
    project_id        : DataTypes.INTEGER,
    unit_id           : DataTypes.INTEGER,
    date              : DataTypes.DATE,
    unit_user_id      : DataTypes.INTEGER,
    status            : DataTypes.INTEGER,
    notes             : DataTypes.TEXT,
    payment_status    : DataTypes.INTEGER,
    due_date          : DataTypes.DATE,
    amount            : DataTypes.FLOAT,
    is_lated          : DataTypes.VIRTUAL,
    payment_date      : DataTypes.VIRTUAL,
    duedate           : DataTypes.VIRTUAL,


  }, {
    underscored       : true,
    tableName         : 'payments'
  });
  Payment.associate = function(models) {
    // associations can be defined here
  };
  Payment.prototype.toJSON =  function () {
    var values = Object.assign({}, this.get());

    if (! values.payment_status) values.payment_status              = "";
    if (! values.amount) values.amount                              = "0";
    if (! values.is_lated) values.is_lated                          = 0;
    delete values.date;
    delete values.due_date;
    return values;
  }

  //getRemainPayment
  Payment.getRemainPayment     = (unit_user_id,total_price) => {
    return new Promise((resolve, reject) => {
     Payment.sum('amount',{  
        where:{
          unit_user_id  : unit_user_id,
          status : [1,2]

        }}).then(sum_count=>{
          resolve(total_price - sum_count)
       })
    })

  };

  return Payment;
};