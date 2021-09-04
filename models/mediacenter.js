'use strict';
module.exports = (sequelize, DataTypes) => {
  const MediaCenter = sequelize.define('MediaCenter', {
    title_en      : DataTypes.STRING,
    title_ar      : DataTypes.STRING,
    image         : DataTypes.STRING,
    youtube_link  : DataTypes.STRING,
    name          : DataTypes.VIRTUAL,
    youtube_id    : DataTypes.VIRTUAL,
    featured      : DataTypes.INTEGER,
    is_publish    : DataTypes.INTEGER,
    added_at      : DataTypes.VIRTUAL,
  }, {
    underscored: true,
    tableName       : 'media_centers'
    
  });
  MediaCenter.associate = function(models) {
    // associations can be defined here
    MediaCenter.prototype.toJSON =  function () {
      var values = Object.assign({}, this.get());
      if (! values.name) values.name                              = "";
      if(  values.image )
      {
        values.image = basicPathImage+"videos/" + values.image;
      }else{
        values.image ="";
      }
      delete values.is_publish;

      /** get youtube id from link*/
      if (values.youtube_link != null) {
        var video_id = (values.youtube_link).split('v=')[1];
        var ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
          video_id = video_id.substring(0, ampersandPosition);
        }
        values.youtube_id = video_id;
      }else{
        values.youtube_id = "";
      }
      /**

      Get Youtube thumbnail images using below urls

      Low quality

       https://img.youtube.com/vi/[video-id]/sddefault.jpg
      medium quality

       https://img.youtube.com/vi/[video-id]/mqdefault.jpg
      High quality

      http://img.youtube.com/vi/[video-id]/hqdefault.jpg
      maximum resolution

      http://img.youtube.com/vi/[video-id]/maxresdefault.jpg


      */

      if(values.image == null || values.image == "" ){
        
        if (values.youtube_id  != null) {
          values.image = "https://img.youtube.com/vi/"+values.youtube_id+"/hqdefault.jpg"; 
        }
        

      }
       delete values.created_at;
      return values;
    }
  };
  return MediaCenter;
};