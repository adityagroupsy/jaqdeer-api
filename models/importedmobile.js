'use strict';
module.exports = (sequelize, DataTypes) => {
  const ImportedMobile = sequelize.define('ImportedMobile', {
    
    imported_contact_id: DataTypes.INTEGER,

    mobile: DataTypes.STRING
  }, {
    underscored: true,
    tableName :'imported_mobiles',
  });
  ImportedMobile.associate = function(models) {
    // associations can be defined here
  };
  return ImportedMobile;
};