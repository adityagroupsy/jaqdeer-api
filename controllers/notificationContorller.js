const models  				= require('../models');
const notificationApi 		= {};
var serverKey	 			= require("../config/fcm.json");

var FCM 					= require('fcm-node')
const { Op } 				= require('sequelize');

var fcm 					= new FCM(serverKey)

notificationApi.notify 		= (req,res) =>{
	var message 			= { 
	    registration_ids 				: req.body.token, 
	    notification 	: {
	        title : req.body.title, 
	        body  :  req.body.message 
	    },
	}
	fcm.send(message, function(err, response){
	    if (err) {
	        return res.json({msg:err.message});
	    } else {
	    	
	        return res.json({msg:"ok"});
	    }
	});
};

const send_notify = (token,title,messege,data) =>{
	return new Promise((resolve, reject) => {
		var message = {
		    registration_ids 				: token,  	    
		    notification 					: {
		        title 						: title, 
		        body  						: messege  
		    }
		}
		fcm.send(message, function(err, response){
		    if (err) {
		        resolve(err);
		    } else {
		        resolve('true') ;
		    }
		});
	}).catch(error => {
		reject(error);
		
	});
};



notificationApi.send_notification 	= function (data) {

	return new Promise((resolve, reject) => {
	  //user_model 1 for normal user , 2 for provider user
	  let token = [];
	  /*
		type == 1 go to home  

		type == 2 go to offer detail

		type == 3 go to order detail  

	  */
		models.Notification.create({ 
			user_id 		: 		data.user_id,
			user_model 		: 		data.user_type,
			type			: 		data.object_type,
			message 		:   	data.message,
			title 			:   	data.title,
			object_id 		:   	data.object_id,
			is_read 		:   	0,
			created_at 		: 		new Date() ,
			updated_at 		: 		new Date() ,

		});
		const promises 				= [] ;
		if(data.user_type 			== 1){
			const promise 			= getUserFCMTokens(data.user_id).then(user_tokens =>{
				token 				= user_tokens;
			});
			promises.push(promise);

		}else if(data.user_type 	== 2){
			const promise 			= getProviderFCMTokens(data.user_id).then(provider_tokens =>{
				token 				= provider_tokens;
			});
			promises.push(promise);
		}
		

		Promise.all(promises).then(results => {
			let msg 			= '';
			if(token.length 	> 0){
				let other_data 	= { object_id:data.object_id ,notification_type : data.object_type };
				const promises1 	= [] ;
			
				const promise 	= send_notify(token,data.title,data.message,other_data).then(token_sent =>{
					msg 		= token_sent;
				});
				promises1.push(promise);
				Promise.all(promises1).then(results => {
					resolve( 'done');
				}).catch(error => {
			console.log(error);
					
					reject(error);
				});
			}else{
				resolve( 'done');
			}
		}).catch(error => {
			console.log(error);
			reject(error);
			
		});
    });
	
};

const getProviderFCMTokens = (provider_id) =>{
	return new Promise((resolve, reject) => {
		models.Device.findAll({  where:{ user_id: provider_id,user_model:2, register_token : { [Op.ne]: null} , register_token : { [Op.ne]: ''}  } } ).then(user_login => {
            let tokens = [] ;
            if(user_login){
               tokens =  user_login.map(function(item){
                if(item['register_token'] != null && item['register_token'] != ""){
                  return item['register_token'];
                }
              });
            }
            resolve(tokens) ;
      }).catch(error => {
          reject(error.message);
      });
    });
};

const getUserFCMTokens = (user_id) =>{
	return new Promise((resolve, reject) => {
		models.Device.findAll({  where:{ user_id: user_id,user_model:1 , register_token : { [Op.ne]: null} , register_token : { [Op.ne]: ''} } } ).then(user_login => {
            let tokens = [] ;
            if(user_login){
               tokens =  user_login.map(function(item){
	                if(item['register_token'] != null && item['register_token'] != "" && item['register_token'] != undefined){
	                	return item['register_token'];
	                }
              });
            }
            resolve(tokens) ;

      }).catch(error => {
          reject(error.message);
      });
    });
};



module.exports = notificationApi;