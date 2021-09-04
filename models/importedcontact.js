'use strict';
module.exports = (sequelize, DataTypes) => {
  const ImportedContact = sequelize.define('ImportedContact', {
    user_id     : DataTypes.INTEGER,
    mobile      : DataTypes.STRING,
    phone1      : DataTypes.STRING,
    phone2      : DataTypes.STRING,
    phone3      : DataTypes.STRING,
    first_name  : DataTypes.STRING,
    last_name   : DataTypes.STRING,
    name        : DataTypes.STRING
  }, {
    underscored: true,
     tableName       : 'imported_contacts'
  });
  ImportedContact.associate = function(models) {
    // associations can be defined here
  };
  return ImportedContact;
};