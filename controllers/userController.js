/* User Controllers for Normal User Apis*/
const models  				= require('../models');
const configJwt 			= require('../config/jwt.json');
const langString 			= require('../locales/attributes.json');
const date 					= require('date-and-time');
const api 					= {};
const notifyFcm             = require('../controllers/notificationContorller.js');
const notifyEmail           = require('../controllers/emailContorller.js');
const { Op } 				= require('sequelize');

/**
login
register
check_forget_password_code
send_forgot_password_code
update_password_by_code
send_verify_code
confirm_verify_code
check_mobile
check_email
refresh_fcm_token
get_about_data
send_feedback
search
filter
get_user_data
update_password
change_language
logout
list_user_notifications
read_user_notifications
delete_user_notifications
count_user_notifications
calculate_decore_price
request_decore
list_decore_types
*/

api.get_whatsapp_phone = (req, res) => { 
    language_code = req.language;
    models.Setting.findAll({where:{
        key : {[Op.in]:["whatsapp_mobile","hotline_number"]}
    }}).then(about => {
        let data = { 
            "whatsapp_mobile"   : "",
            "hotline_number"    : ""
        };
        if (about) {
            for (let i = 0, len = about.length; i < len; i++) {
                let value   = "";
                value       = about[i].value;
                let key     = about[i].key;
                data[key]   = value;
            }
        }
        return  res.status(200).send({msg:'done',status:'200',data: data});
    }).catch(error => {
        return res.status(500).send({msg:error.message,status:'500'});
    });
    
};/* get about data */

api.get_about_data = (req, res) => { 
    language_code = req.language;
    models.Setting.findAll({where:{
        key : {[Op.in]:["website","mobile","email","facebook","twitter","messenger","instagram","youtube","image",
        "linkedin","latitude","longitude","about","vision","mission"]}
    }}).then(about => {
        let data = { 
            "website"   : "",
            "mobile"    : "+2 0100 326 562",
            "email"     : "support@jadeer.com",
            "facebook"  : "",
            "messenger" : "",
            "twitter"   : "",
            "instagram" : "",
            "linkedin"  : "",
            "latitude"  : "",
            "longitude" : "",
            "about"     : "",
            "mission"   : "",
            "vision"    : "",
            "youtube"   :"",
            "image"   :"",
        };
        if (about) {
            for (let i = 0, len = about.length; i < len; i++) {
                let value = "";

                if ( (['vision','mission','about'].includes(about[i].key ))) {
                    if (language_code == "ar") {
                        value = about[i].value_ar;
                    }else{
                        value = about[i].value;
                    }
                }else if ( (['image'].includes(about[i].key ))) {
                    if (about[i].value != "") {
                        value = basicPathImage+"about/" + about[i].value;
                    }
                }else{
                    value =about[i].value;
                }

                let key =about[i].key;
                data[key] = value;
            }
        }
        return  res.status(200).send({msg:'done',status:'200',data: data});
    }).catch(error => {
        return res.status(500).send({msg:error.message,status:'500'});
    });
    
};/* get about data */

api.get_company_progress = (req, res) => { 
    language_code = req.language;
    models.Setting.findAll({
        where:{
            'key':{[Op.in]:['company_sold_units','progress_percentage','company_progress','no_compounds']}
        }
    }).then(about => {
        const promises1 = [];
        let titles      = [];
        let served_clients = "";
        let completed_projects = "";
        let sold_units = "";
        const promiss1_1 = get_page_customer_title(8,language_code)
        .then(return_titles =>{
            titles = return_titles;
            if (titles.length >0) {
                titles.forEach(title=>{
                    
                    if (title.key == 'sold_units') {

                        sold_units = title.name;
                    }
                    if (title.key == 'completed_projects') {

                        completed_projects = title.name;
                    }
                    if (title.key == 'served_clients') {

                        served_clients = title.name;
                    }
                    
                });
            }
        });
        promises1.push(promiss1_1)
        Promise.all(promises1).then(results => {
            let data = { 
                "company_sold_units"    : "",
                "progress_percentage"   : "",
                "company_progress"      : "",
                "no_compounds"          : "",
                "served_clients"        : served_clients,
                "completed_projects"    : completed_projects,
                "sold_units"            : sold_units,
            };
            if (about) {
                for (let i = 0, len = about.length; i < len; i++) {
                    let value =about[i].value;
                    let key =about[i].key;
                    data[key] = value;
                }
            }
            return  res.status(200).send({msg:'done',status:'200',data: data});
        }).catch(error => {
            return res.status(500).send({msg:error.message,status:'500'});
        });
    });
    
};/* get about data */

api.get_user_data = (req,res) =>{
    let user                        = req.user;
    let language_code               = req.language;
    if (! user) {
        return res.status(403).send({msg: 'Unauthorized token.',"status":"403" });
    }
    if (language_code == 'ar') {
        user.points = ((user.points).toString()).toArabicDigits();
    }
    msg = 'Done.';
    return res.status(200).send({msg:msg,status:'200',data:user});

}/*get_user_data*/

api.check_mobile = (req,res) => {
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let mobile                  = req.body.mobile;
    let language_code           = req.language;
    let msg                     = "";

    let check_attributes        =  mobile  ;
    if (! check_attributes)  return res.status(452).send({msg:'missing_data',status:'452'}); 

    let mobilevalidator               = require("phone");

    /*if( mobilevalidator(mobile,'EG').length < 1){
        msg = langString[language_code].validate_mobile;
        return res.status(461).send({msg:msg,status:'461'});
    }
    */

    /*check if mobile does not exist in db */
    models.User.findOne({where:{ mobile: mobile,is_registered:1}}).then( user1 => {
        if (user1) {
            msg = langString[language_code].register_exist_mobile;
            return res.status(454).send({msg:msg,status:'454'});
        }else{
            msg = 'done';
            return res.status(200).send({msg:msg,status:'200'});
        }
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        
};/* check_mobile*/

api.check_email = (req,res) => {
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});

    let email                  = req.body.email;
    let language_code           = req.language;
    let msg                     = "";

    let check_attributes        =  email  ;
    if (! check_attributes)  return res.status(452).send({msg:'missing_data',status:'452'});  
    let validator               = require("email-validator");

    if(! validator.validate(email)){
        msg = langString[language_code].validate_email;
        return res.status(460).send({msg:msg,status:'460'});
    }
  
    /*check if email does not exist in db */
    models.User.findOne({where:{ email: email,is_registered:1}}).then( user1 => {

        if (user1) {
            msg = langString[language_code].register_exist_email;
            return res.status(455).send({msg:msg,status:'455'});
        }else{
            msg = 'done';
            return res.status(200).send({msg:msg,status:'200'});
        }
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        
};/* check_email */

api.register = (req,res) => {
    
	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let first_name                  = req.body.first_name;
    let last_name                   = req.body.last_name;
    let customer_code               = req.body.customer_code;
	let email 						= req.body.email;
	let mobile 						= req.body.mobile;
	let password 					= req.body.password;
	let version 					= req.body.version;
	let platform 					= req.body.platform;
	let device_id 					= req.body.device_id;
	let language_code               = req.language;
	let msg 						= "";
	let check_attributes 			= first_name && last_name && email  && mobile && password  && version && device_id && platform  ;

	if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    if (! (['android','ios'].includes(platform))) return res.status(453).send({msg:'invalid_platform',status:'453'});

    let emailvalidator               = require("email-validator");
    if(! emailvalidator.validate(email)){
        msg = langString[language_code].validate_email;
        return res.status(460).send({msg:msg,status:'460'});
    }
   /* let mobilevalidator               = require("phone");
    if( mobilevalidator(mobile,'EG').length < 1){
        msg = langString[language_code].validate_mobile;
        return res.status(461).send({msg:msg,status:'461'});
    }

    */
	/*check if mobile does not exist in db */
	models.User.findOne({where:{ mobile: mobile , is_registered:1 }}).then( user1 => {
        if (user1) {
        	msg = langString[language_code].register_exist_mobile;
			return res.status(454).send({msg:msg,status:'454'});
        }else{

        	models.User.findOne({where:{ email: email , is_registered:1 }}).then( user2 => {
		        if (user2 && email != "") {
		        	msg = langString[language_code].register_exist_email;
					return res.status(455).send({msg:msg,status:'455'});
		        }else{

                    if(customer_code == ""){

                        models.User.findOne({where:{ mobile: mobile }}).then( user1 => {
                            if (user1) {
                                msg = langString[language_code].register_missing_customer;
                                return res.status(454).send({msg:msg,status:'462'});
                            }else{

                                models.User.findOne({where:{ email: email }}).then( user2 => {
                                    if (user2 && email != "") {
                                        msg = langString[language_code].register_missing_customer;
                                        return res.status(455).send({msg:msg,status:'462'});
                                    }else{

                                        models.User.hashPassword(password).then(hashed => {
                                            
                                            models.User.create({
                                                first_name          : first_name,
                                                last_name           : last_name,
                                                customer_code       : customer_code,
                                                email               : email,
                                                lang                : language_code,
                                                mobile              : mobile,
                                                password            : hashed,
                                                is_registered       : 1,
                                                
                                            }).then(user => {
                                                var redis                                       = require('redis');
                                                var JWTR                                        =  require('jwt-redis').default;
                                                var redisClient                                 = redis.createClient();
                                                var jwtr                                        = new JWTR(redisClient);

                                                var payload = {user: user.id,device:device_id , type:1 };
                                                // Create a token
                                                jwtr.sign(payload, configJwt.secret).then(myToken =>{
                                                    
                                                    user.token                              = myToken;
                                                    
                                                        models.Device.findOrCreate({ where:{ device_id: device_id,user_model:1 }, 
                                                        defaults: { device_id: device_id,user_id:user.id,user_model:1 }}).spread((user_device,created) => {
                                                        if (user_device) {
                                                            user_device.version             = version;
                                                            user_device.platform            = platform;
                                                            user_device.device_id           = device_id;
                                                            user_device.user_id             = user.id;
                                                            user_device.status              = 1;
                                                            user_device.user_model          = 1;

                                                        }
                                                        user_device.save().then(user_device_saved => {
                                                            msg = langString[language_code].register_done;
                                                            return res.status(200).send({ msg:msg,status:'200',data:user});
                                                        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                                                    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                                                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                                            }).catch(error => {  return res.status(500).send({msg:error.message,status:'500'});});
                                        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

                                    }

                                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

                            }

                         }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

                    }else{
                    
                        models.CustomerCode.findOne({where:{ is_publish: 1 , is_used:{[Op.ne]:1} , code : {[Op.like]:customer_code} }}).then( codeCheck => {
                            if (! codeCheck) {
                                msg = langString[language_code].customer_code_wrong;
                                return res.status(462).send({msg:msg,status:'462'});
                            }else{
            		        	models.User.hashPassword(password).then(hashed => {
                                    models.User.create({
                                        first_name          : first_name,
                                        last_name           : last_name,
                                        customer_code       : customer_code,
                                        email               : email,
                                        lang                : language_code,
                                        mobile              : mobile,
                                        password            : hashed,
                                        is_registered       : 1,
                                        
                                    }).then(user => {


                                        codeCheck.is_used = 1;

                                        codeCheck.save().then(saved_check=>{
                                            var redis                                       = require('redis');
                                            var JWTR                                        =  require('jwt-redis').default;
                                            var redisClient                                 = redis.createClient();
                                            var jwtr                                        = new JWTR(redisClient);

                                            var payload = {user: user.id,device:device_id , type:1 };
                                            // Create a token
                                            jwtr.sign(payload, configJwt.secret).then(myToken =>{
                                                
                                                user.token                              = myToken;
                    							/* save device in device users and create real time token*/	
                    							models.Device.findOrCreate({ where:{ device_id: device_id,user_model:1 }, 
                    								defaults: { device_id: device_id,user_id:user.id,user_model:1 }}).spread((user_device,created) => {
                    								if (user_device) {
                    									user_device.version 			= version;
                    									user_device.platform 			= platform;
                    									user_device.device_id 			= device_id;
                    									user_device.user_id 			= user.id;
                    									user_device.status 				= 1;
                    									user_device.user_model 			= 1;
                    								}
                    								user_device.save().then(user_device_saved => {
                    									msg = langString[language_code].register_done;
                    									return res.status(200).send({ msg:msg,status:'200',data:user});
                    								}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                                                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                                            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                						}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
            						}).catch(error => {  return res.status(500).send({msg:error.message,status:'500'});});
            					}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                            }
                        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                    }
				}
			}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        }
	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});				  

};/*Normal register*/

api.login = (req,res) => {
	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
	let email 						= req.body.email;
	let password 					= req.body.password;
	let device_id 					= req.body.device_id;
	let version 					= req.body.version;
	let platform 					= req.body.platform;
	let msg 						= "";
	let language_code               = req.language;
	let check_attributes               = email && password  && platform && version && device_id  ;
	if (! check_attributes)	return res.status(452).send({msg:'missing_data',status:'452'});
	if (! (['android','ios'].includes(platform))) return res.status(453).send({msg:'invalid_platform',status:'453'});
    
    models.User.findOne({where:{ email: email  } } ).then(user => {
        if (! user) {
            msg = langString[language_code].login_not_exist_email;
            return res.status(456).send({msg:msg,status:'456'});
        }
       if (! user && user.is_block == 1) {
            msg = langString[language_code].user_blocked;
            return res.status(421).send({msg:msg,status:'421'});
        }else{ 
        	models.User.findOne({where:{ email: email , is_registered : 1 } } ).then(user => {
        	    if (! user) {
                	msg = langString[language_code].login_wrong_password;
        			return res.status(456).send({msg:msg,status:'456'});
        	    }else{
        	    	let user_pass  		= user.password;
        			user_pass 			= user_pass.replace('$2y$', '$2b$');
        			const bcrypt        = require('bcryptjs');
                    
        			bcrypt.compare(password, user_pass, function(err, resPassword) {
        			  	if(resPassword) {
        			  		if ( user.is_block == 1){
                                msg = langString[language_code].user_blocked;
                                return res.status(421).send({msg:msg,status:'421'});
                            }else{
        						var redis                                       = require('redis');
                                var JWTR                                        =  require('jwt-redis').default;
                                var redisClient                                 = redis.createClient();
                                var jwtr                                        = new JWTR(redisClient);

                                var payload = {user: user.id,device:device_id , type:1 };
                                // Create a token
                                jwtr.sign(payload, configJwt.secret).then(myToken =>{
                                    
                                    user.token                              = myToken;
                                
            						models.Device.findOrCreate({ where:{ device_id: device_id ,user_model:1}, 
            							defaults: { device_id: device_id,user_id:user.id ,user_model:1}}).spread((user_device,created) => {
            							if (user_device) {
            								user_device.version 			= version;
            								user_device.platform 			= platform;
            								user_device.device_id 			= device_id;
            								user_device.user_model 			= 1;
            								user_device.user_id 			= user.id;
            								user_device.status 				= 1;
            							}
            							user.lang                           = language_code;
                                        
            							user.save().then(user_device_saved => {
                                            
            								user_device.save().then(user_device_saved => {

            			            			msg = langString[language_code].login_done;
            									return res.status(200).send({msg:msg,status:'200',data:user});

            								}).catch(error => { return res.status(500).send({msg:error.message,status:'500'});});
            							}).catch(error => { return res.status(500).send({msg:error.message,status:'500'});});

                                    }).catch(error => { return res.status(500).send({msg:error.message,status:'500'});});   
            				    }).catch(error => { return res.status(500).send({msg:error.message,status:'500'});});	
        					}

        			  	} else {
        		            msg = langString[language_code].login_wrong_password;
        					return res.status(457).send({msg:msg,status:'457'});
        			  	} 
        			});
        		}

	       });
        }
    });

};/* Login **/

api.refresh_fcm_token = (req,res) =>{
	let user 						= req.user;
	let register_token 				= req.body.fcm_token;
    let device_id                   = req.body.device_id;
    let platform 					= req.body.platform;
	let msg 						= "";
	let language_code               = req.language;

	let check_attributes 			= register_token && device_id && platform ;

	if (! check_attributes)	return res.status(452).send({msg:'missing_data',status:'452'});
    
	models.Device.findOrCreate({ where:{ device_id: device_id ,user_model:1}, 

		defaults: { device_id: device_id,user_id:user.id ,user_model:1}}).spread((user_device,created) => {
		if (user_device) {
            user_device.register_token      = register_token;
			user_device.platform 		    = platform;
			user_device.device_id 			= device_id;
			user_device.user_model 			= 1;
			user_device.user_id 			= user.id;
			user_device.status 				= 1;

		}
		user_device.save().then(user_device_saved => {
			return res.status(200).send({msg:'done',status:'200'});

		}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});	

};/** refresh_fcm_token **/

api.refresh_socket_token = (req,res) =>{
    let user                                = req.user;
    let socket_id                           = req.body.socket_id;
    let device_id                           = req.body.device_id;
    let msg                                 = "";
    let language_code                       = req.language;

    let check_attributes                    = socket_id && device_id  ;

    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

    models.Device.findOrCreate({ where:{ device_id: device_id ,user_model:1}, 
        defaults: { device_id: device_id,user_id:user.id ,user_model:1}}).spread((user_device,created) => {
        if (user_device) {
            
            user_device.device_id           = device_id;
            user_device.user_model          = 1;
            user_device.user_id             = user.id;
            user_device.status              = 1;
            
        }
        user_device.save().then(user_device_saved => {
            return res.status(200).send({msg:'done',status:'200'});

        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});    

};/** refresh_socket_token **/

api.send_fcm_notification = (req,res) =>{
    let user_tokens                         = req.body.tokens;
    let title                               = req.body.message.title;
    let message                             = req.body.message.message;
    let chat_id                             = req.body.message.chat_id;
    let msg                                 = "";
    const promises                          = [];
    let check_attributes                    = user_tokens && message  ;

    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    models.Device.findAll({ where:{ register_token : {[Op.in]:user_tokens}} }).then( devices => {
        const promises   = [];
        if(devices.length >0){
            devices.forEach( device => {
                let notify  = {
                    message     : message ,
                    title       : title ,
                    user_type   : 1 ,
                    object_id   : chat_id,
                    object_type : 1 ,
                    user_id     : device.user_id
                }
                const promisex               = notifyFcm.send_notification(notify).then(sent_notify =>{
                    let msg_sent             = sent_notify; 
                });
                promises.push(promisex);
            }); 
        }
        Promise.all(promises).then(results => {
            return res.status(200).send({msg:'done',status:'200'});

        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});    
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});    

};/** send_fcm_notification **/

api.logout = async (req,res) => {
    let user                        = req.user;
    let device_id                   = req.body.device_id;
    let language_code               = req.language;
    var redis                       = require('redis');
    var JWTR                        =  require('jwt-redis').default;
    var redisClient                 = redis.createClient();
    var jwtr                        = new JWTR(redisClient);

    let msg                         = "";
    if (! device_id)        return res.status(452).send({msg:'missing_data',status:'452'});
    let removed_tolken = await jwtr.destroy(req.decoded.jti,configJwt.secret)

    if(removed_tolken){
        models.Device.destroy({where:{ device_id: device_id ,user_id : user.id ,user_model:1 }})
            .then( removed =>{
                msg = langString[language_code].logout_done;
                return res.status(200).send({msg:msg,status:'200'});
            })
            .catch(error => {
                return resres.status(500).send({msg:error.message,status:'500'});
        });
    }else{
        msg = langString[language_code].logout_done;
        return res.status(200).send({msg:msg,status:'200'});
    }   

};/* logout **/

api.update_password = (req,res) => {

    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let user                        = req.user;
    let old_password                = req.body.old_password;
    let password                    = req.body.new_password;
    let msg                         = "";
    let language_code               = req.language;
    let check_attributes            =  old_password && password ;

    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

    let user_pass                   = user.password;
    user_pass                       = user_pass.replace('$2y$', '$2b$');
    const bcrypt                    = require('bcryptjs');

    bcrypt.compare(old_password, user_pass, function(err, resPassword) {
        if(resPassword) {
            models.User.hashPassword(password).then( hashed => {

                user.password = hashed;
                //update password with new one 
                user.save().then(savedUser => {
                    msg = langString[language_code].change_password_done;
                        
                    return res.status(200).send({msg:msg,status:'200'});
                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

        }else{
            msg = langString[language_code].login_wrong_password;
            return res.status(457).send({msg:msg,status:'457'});
        }
    });

};/*update password using old password*/

api.change_language  = (req, res) => { 
    let user                    = req.user;
    let msg                     = "";
    let language_code           = req.language;
    
    models.User.update({lang:language_code},{
            where:{ id: user.id }
    }).then(data =>{
        msg = langString[language_code].change_language;

        return  res.status(200).send({msg:msg,status:'200'});
    });
     
};/*update language*/

api.send_forgot_password_code = (req,res) => {
	//type:1 when normal user is logged
	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
	let email 						= req.body.email;
    let language_code           	= req.language;

	let msg 						= "";

	if (! email) return res.status(452).send({msg:'missing_data',status:'452'});

	models.User.findOne({where:{ email: email ,is_registered:1  } } ).then(user => {
	    if (! user) {
        	msg = langString[language_code].login_not_exist_email;
			return res.status(456).send({msg:msg,status:'456'});
	    }else{
	    	let forgot_password_code = generateRandomInt(4);
            
    		models.VerifyCode.update({is_used:1},{
	    		where:{ user_id: user.id , is_used : 0 ,type:2  ,user_model:1 }
	    	}).then( data =>{
                let message                 = "";
                let title                   = "";
                const promises              = [] ;
                let mail_code    	        = generateRandomInt(4); 
                if (language_code == 'en') {
                    title                   = "Forgot Password";
                    message                 = 'Jadeer Forgot Password Code : '+mail_code;
                }else{
                    message                 = 'كود تغيير كلمة المرور : '+mail_code;
                    title                   = 'نسيت كلمة المرور';
                }
                
                const promise               = models.VerifyCode.new_code(user.id,1,2,mail_code).then(sent_sms =>{
                    let msg_sent            = sent_sms;
                });

                promises.push(promise);

                const promise1               = notifyEmail.sendMail(email , message , title).then(sent_sms =>{
                    let msg_sent            = sent_sms;
                });
                promises.push(promise1);


                Promise.all(promises).then(results => {
                    msg = langString[language_code].send_forgot_code;
                    return res.status(200).send({msg:msg,status:'200',mail_code:mail_code});

                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    		}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	    }
	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	
};/*send sms to forgot password by email*/

api.check_forget_password_code = (req,res) => {

	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let language_code           	= req.language;

	let email 						= req.body.email;
	let msg 						= "";
	let mail_code 					= req.body.mail_code;

	let check_attributes 			=  email && mail_code  ;

	if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    
	models.User.findOne({where:{ email: email  ,is_registered:1  } } ).then(user => {
	    if (! user) {
        	msg = langString[language_code].login_not_exist_mobile;
			return res.status(456).send({msg:msg,status:'456'});
	    }else{
            
	    	models.VerifyCode.findOne({
	    		where:
	    		{ 	user_id: user.id ,
	    			invalid_date: { [Op.gte] : new Date()}, 
	    			is_used : 0,
	    			type:2 ,
	    			code:mail_code
	    		} 
	    	}).then(forgot_password => {
	    		if (forgot_password) {
        			msg = langString[language_code].correct_code;
	    			return res.status(200).send({msg:msg,status:'200'});
	    		}else{
        			msg = langString[language_code].wrong_code;
	    			return res.status(459).send({msg:msg,status:'459'});
	    		}
	    	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	    }
	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

};/*check_forget_password_code*/

api.update_password_by_code = (req,res) => {
	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
	let email 						= req.body.email;
	let mail_code 					= req.body.mail_code;
	let msg 						= "";
    let language_code           	= req.language;
	let password 					= req.body.password;
	let check_attributes 			=  email && mail_code && password ;
	if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

	models.User.findOne({where:{ email: email ,is_registered:1  } } ).then(user => {
	    if (! user) {
        	msg = langString[language_code].login_not_exist_email;
			return res.status(456).send({msg:msg,status:'456'});
	    }else{
            var d                   = new Date();
            var local               = d.getTime();
            var offset              = d.getTimezoneOffset() * (60 * 1000);
            var utc                 = new Date(local + offset);
            var cairoNow             = new Date(utc.getTime() + (2 * 60 * 60 * 1000));
            cairoNow                 = date.format(new Date(cairoNow),'YYYY-MM-DD HH:m:s');
          
	    	models.VerifyCode.findOne({
	    		where:{ 
	    			user_id 		: user.id , 
	    			is_used  	 	: 0,
	    			type  			: 2 ,
	    			code 	    	: mail_code,
	    		} ,
                order : [['id', 'DESC']]
	    		}).then(forgot_password => {

	    		if (forgot_password) {
                   // cairoNow = date.addHours(new Date(cairoNow ),12);
                    let invalid_date =  forgot_password.invalid_date ;
                   
           
                    let diff = date.subtract( new Date(cairoNow ), new Date(invalid_date)).toMinutes(); 
             
                    if (diff > 15 ) {
                        msg = langString[language_code].wrong_code;
                        return res.status(459).send({msg:msg,status:'459'});
                    }

                    
	    			models.User.hashPassword(password).then( hashed => {
	    				user.password 	= hashed;
	    				user.save().then(savedUser => {
	    					forgot_password.is_used = 1;
                            
				    		forgot_password.save().then(data => {
        						msg 	= langString[language_code].change_password_done;
				    			return res.status(200).send({msg:msg,status:'200'});
							}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
						}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	    			}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	    		}else{
        			msg = langString[language_code].wrong_code;
	    			return res.status(459).send({msg:msg,status:'459'});
	    		}
	    	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	    }
	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

};/*update password with code and mobile*/

api.update_user_data = (req,res) => {
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let email                   = req.body.email;
    let mobile                  = req.body.mobile;
    let language_code           = req.language;
    let password                = req.body.new_password;
    let old_password            = req.body.old_password;
    let msg                     = "";
    let user                    = req.user;

    let check_attributes        = email && mobile ;
    if (! check_attributes)  return res.status(452).send({msg:'missing_data',status:'452'});    
    let emailvalidator               = require("email-validator");
    if(! emailvalidator.validate(email)){
        msg = langString[language_code].validate_email;
        return res.status(460).send({msg:msg,status:'460'});
    }
   /* let mobilevalidator               = require("phone");
    if( mobilevalidator(mobile,'EG').length < 1){
        msg = langString[language_code].validate_mobile;
        return res.status(461).send({msg:msg,status:'461'});
    }

    */
    models.User.findOne({where:{ email: email ,is_registered:1, id : {[Op.ne]: user.id} }}).then( user1 => {
        if (user1) {
            msg = langString[language_code].register_exist_email;
            return res.status(455).send({msg:msg,status:'455'});
        }else{
            models.User.findOne({where:{ mobile: mobile ,is_registered:1, id : {[Op.ne]: user.id} }}).then( user1 => {
                if (user1) {
                    msg = langString[language_code].register_exist_mobile;
                    return res.status(454).send({msg:msg,status:'454'});
                }else{
                    if (password != "" ) {
                        if (! old_password)  return res.status(452).send({msg:'missing_data',status:'452'});   
                        let user_pass                   = user.password;
                        user_pass                       = user_pass.replace('$2y$', '$2b$');
                        const bcrypt                    = require('bcryptjs');

                        bcrypt.compare(old_password, user_pass, function(err, resPassword) {
                            if(resPassword) {
                                models.User.hashPassword(password).then( hashed => {
                                    user.email                 = email;
                                    user.mobile                = mobile;
                                    user.password              = hashed;
                                    //update password with new one 
                                    
                                    user.save().then(savedUser => {
                                        msg = langString[language_code].update_done;
                                        return res.status(200).send({msg:msg,status:'200',data:user});
                                    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

                                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

                            }else{
                                msg = langString[language_code].update_wrong_password;
                                return res.status(457).send({msg:msg,status:'457'});
                            }
                        });
                    }else{
                        user.email                 = email;
                        user.mobile                = mobile;
                        /*save new data */
                        
                        user.save().then(update_data => {
                            msg = langString[language_code].update_done;
                            return res.status(200).send({msg:msg,status:'200',data:user});
                        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
                    } 
                }
            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        }
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        
};/* update name data*/

api.update_user_image = (req,res) => {
	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
	let language_code 			= req.language;

	let image 					= req.body.image;
	let msg 					= "";
	let user 					= req.user;

	let check_attributes 		= image  ;
	if (! check_attributes)  return res.status(452).send({msg:'missing_data',status:'452'});	
	if ( image ) {
		
		if (image.includes('data:image/')) {
			type 			= image.split(';')[0].split('/')[1];
		    image_base64 	= image.split('base64,')[1];

		}else{
			type 			= 'jpg';
			image_base64 	= image;
		}
		
		const image_name 	= user.id+"."+type;
		const image_path 	= "../httpdocs/public/images/users/"+image_name;

		require("fs").writeFile(image_path, image_base64, 'base64', function(err) {
		  	user.image 		= image_name;
		});
		user.image 			= image_name;

	}
	/*save new data */
	
    user.save().then(update_data => {
		msg = langString[language_code].update_done;
		return res.status(200).send({msg:msg,status:'200',data:user});

	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
		
};/* update profile data*/

api.update_password = (req,res) => {

	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
	let user 						= req.user;
	let old_password 				= req.body.old_password;
	let password 					= req.body.new_password;
	let msg 						= "";
	let language_code               = req.language;
	

	let check_attributes 			=  old_password && password ;

	if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

	let user_pass 					= user.password;
	user_pass 						= user_pass.replace('$2y$', '$2b$');
	const bcrypt        			= require('bcryptjs');

	bcrypt.compare(old_password, user_pass, function(err, resPassword) {
	  	if(resPassword) {
			models.User.hashPassword(password).then( hashed => {

				user.password = hashed;
				//update password with new one 
                
				user.save().then(savedUser => {
		    		msg = langString[language_code].change_password_done;
						
		    		return res.status(200).send({msg:msg,status:'200'});
				}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

			}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

		}else{
			msg = langString[language_code].login_wrong_password;
	    	return res.status(457).send({msg:msg,status:'457'});
		}
	});

};/*update password using old password*/

api.send_feedback = (req,res) => {
	//type 1 when user send contact us message
	if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
	let subject 					= req.body.subject;
	let message 					= req.body.message;
	let user 						= req.user;
	let msg 						= "";
    let language_code           	= req.language;

	let check_attributes =   message && subject  ;
	if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

	//check if message type exist or not 
	models.Feedback.create({
		name 					: user.first_name +' '+ user.last_name ,
		mobile 					: user.mobile ,
		email 					: user.email ,
		object_type 			: 1 ,
        message                 : message ,
		subject 				: subject ,
		status 					: 0,
		object_id 				: user.id,

	}).then(report_problem => {
    	msg = langString[language_code].contact_us_done;
		return res.status(200).send({msg:msg,status:'200'});

	}).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
	
};//send_feedback

api.request_call = (req,res) => {
    let user                        = req.user;
    let msg                         = "";
    let language_code               = req.language;

    //check if message type exist or not 
    models.RequestCall.create({
        status                  : 0,
        user_id                 : user.id

    }).then(report_problem => {
        msg = langString[language_code].request_call_done;
        return res.status(200).send({msg:msg,status:'200'});

    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    
};//request_call

api.list_showrooms = (req, res) => { 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";

    /*check if all required attributes sent */
    let check_attributes            = offset && take ;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Shoowroom.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['address_'+language_code, 'address'],'id','latitude','longitude'
        ],
       include : [{
            model: models.City,
            as :"city",
            attributes:[
               ['title_'+language_code, 'name'],
            ],
        }],
        offset: offset, limit: take,order: [['id', 'DESC']],
    }).then( showrooms => {
        return res.status(200).send({msg:'done',status:'200', data: showrooms});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

} //list_showrooms

api.list_magazines = (req, res) => { 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";

    /*check if all required attributes sent */
    let check_attributes            = offset && take ;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Magazine.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'title'],'id','image','file'
        ],
        offset: offset, limit: take,order: [['id', 'DESC']],
    }).then( showrooms => {
        return res.status(200).send({msg:'done',status:'200', data: showrooms});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

} //list_showrooms

api.list_projects = (req, res) => { 
    /*
    Status == 1 for progress projects
    status == 2 for sold out projects
    **/
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let status                      = req.body.status;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    
    /** status 1 for progress & 2 for sold out*/
    /*check if all required attributes sent */
    let check_attributes            = offset && take && status;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    if (! (['1','2'].includes(status))) return res.status(453).send({msg:'invalid_status',status:'453'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Project.findAll({ 
        where: { is_publish:1 ,status:status} ,
        attributes:[
           ['title_'+language_code, 'name'],'id','is_favorite',
           ['image_'+language_code, 'image'],
        ],
       include : [
           {
                model: models.City,
                as :"city",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            },
            {
                model: models.Area,
                as :"area",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            },
        ],
        offset: offset, limit: take,order: [['id', 'DESC']],
    }).then( projects => {
        //
        const promises = [];
        projects.forEach(project => {
            const promise1 = models.WishList.getIsFavorits(project.id,user,1).then(user_fav =>{
          
                project.is_favorite = user_fav;
            });
            promises.push(promise1);
        })

        Promise.all(promises).then(results => {
            return res.status(200).send({msg:'done',status:'200', data: projects});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});  
 
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}; //list_projects

api.list_projects_by_city = (req, res) => { 
 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let city                        = req.body.city;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";

    let check_attributes            = offset && take && city;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Project.findAll({ 
        where: { is_publish:1 ,city_id:city} ,
        attributes:[
           ['title_'+language_code, 'name'],'id','is_favorite',
           ['image_'+language_code, 'image'],
        ],
       include : [{
            model: models.City,
            as :"city",
            attributes:[
               ['title_'+language_code, 'name'],
            ],
        }],
        offset: offset, limit: take,order: [['id', 'DESC']],
    }).then( projects => {
        //
        const promises = [];
        projects.forEach(project => {
            const promise1 = models.WishList.getIsFavorits(project.id,user,1).then(user_fav =>{
          
                project.is_favorite = user_fav;
            });
            promises.push(promise1);
        })

        Promise.all(promises).then(results => {
            return res.status(200).send({msg:'done',status:'200', data: projects});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});  
 
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}; //list_projects_by_area

api.list_projects_by_area = (req, res) => { 
 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let area                        = req.body.area;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";

    let check_attributes            = offset && take && area;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});

    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Project.findAll({ 
        where: { is_publish:1 ,area_id:area} ,
        attributes:[
           ['title_'+language_code, 'name'],'id','is_favorite',
           ['image_'+language_code, 'image'],
        ],
       include : [
           {
                model: models.City,
                as :"city",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            },
            {
                model: models.Area,
                as :"area",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            },

        ],
        offset: offset, limit: take,order: [['id', 'DESC']],
    }).then( projects => {
        //
        const promises = [];
        projects.forEach(project => {
            const promise1 = models.WishList.getIsFavorits(project.id,user,1).then(user_fav =>{
          
                project.is_favorite = user_fav;
            });
            promises.push(promise1);
        })

        Promise.all(promises).then(results => {
            return res.status(200).send({msg:'done',status:'200', data: projects});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});  
 
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}; //list_projects_by_area

api.latest_maps = (req, res) => {   
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    
    /** status 1 for progress & 2 for sold out*/
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Map.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id',
           ['image_'+language_code, 'image']
        ],
        offset: offset, limit: take,
        order: [['id', 'DESC']],
    }).then( maps => {
        return res.status(200).send({msg:'done',status:'200', data: maps});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

} //latest_maps

api.latest_projects = (req, res) => {   
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    
    /** status 1 for progress & 2 for sold out*/
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Project.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id','is_favorite',
           ['image_'+language_code, 'image']
        ],
        include : [{
            model: models.City,
            as :"city",
            attributes:[
               ['title_'+language_code, 'name'],
            ],
        },
            {
                model: models.Area,
                as :"area",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            },],
        offset: offset, limit: take,
        order: [['id', 'DESC']],
    }).then( projects => {
        //is favorite
        const promises = [];
        projects.forEach(project => {
            const promise1 = models.WishList.getIsFavorits(project.id,user,1).then(user_fav =>{
                project.is_favorite = user_fav;
            });
            promises.push(promise1);
        })

        Promise.all(promises).then(results => {
            return res.status(200).send({msg:'done',status:'200', data: projects});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}; //latest_projects

api.get_project_by_id = (req, res) => { 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let project_id                  = req.body.project_id;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";    
    let check_attributes            = project_id;
    
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    models.Project.findOne({ 
        where: { is_publish:1  ,id : project_id} ,
        attributes:[
           ['title_'+language_code, 'name'],'id',['image_'+language_code, 'image'],
           'latitude','longitude',['progress_status','progress_percentage'],
           ['description_'+language_code, 'description'],
           ['progress_text_'+language_code, 'progress_text'],
        ],
        include : [{
            model: models.City,
            as :"city",
            attributes:[
               ['title_'+language_code, 'name'],
            ],
        },
            {
                model: models.Area,
                as :"area",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            },
        ],
    }).then( project => {
        if (! project) {
            msg = langString[language_code].project_not_found;
            return res.status(419).send({msg:msg,status:'419'});
        }
        const promises = [];
        if(project){
            const promise1 = models.Project.get_project_data(project.id,language_code).then(project_data =>{
                project.units       = project_data['units'];
                project.services    = project_data['services'];
                project.images      = project_data['images'];
                if (project.image !='' && project.image != null  ) {
                    (project.images).push(basicPathImage+"projects/" +project.image )
                }
            });
            promises.push(promise1);
            if ((project.name) != null && language_code == "ar") {
                project.name = (project.name).toArabicDigits();
            }
            if ((project.description) != null && language_code == "ar") {
                project.description = (project.description).toArabicDigits();
            }

            const promise2 = models.WishList.getIsFavorits(project.id,user,1).then(user_fav =>{
        
                project.is_favorite = user_fav;
            });
            promises.push(promise2);
        }
        Promise.all(promises).then(results => {

            const promises2 = [];
            (project.units).forEach(unit => {
                const promise1 = models.WishList.getIsFavorits(unit.id,user,2).then(user_fav =>{
                    unit.is_favorite = user_fav;
                });
                promises2.push(promise1);
            })

            Promise.all(promises2).then(results => {
                return res.status(200).send({msg:'done',status:'200', data: project});
                
            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}; //get_project_by_id

api.list_sliders = (req, res) => { 
    /*
      object_type :: 
      0 == > None
      1 == > catalog
      2 == > project details
      3 == > All News
      4 == > News Details
      5 == > All Videos
      6 == > Open Video
      7 == > profile
      8 == > Registration
      9 == > External Link
    */
    let language_code               = req.language;

    let user                        = req.user;
    let msg                         = "";
    if (user) {
        //if user loged in :: slider registeration not appear to user
        models.Slider.findAll({
            where: { is_publish:1,[Op.or]:[{finished_at: { [Op.gte] : new Date() }},{finished_at:null}] ,object_type : {[Op.notIn] :[8] } } ,
            attributes:[
                ['title_'+language_code, 'title'],['sub_title_'+language_code, 'sub_title'],
                ['image_'+language_code, 'image'],'id','object_id','object_type','external_link'
            ],
            limit: 5,
            order: [
                ['created_at', 'desc']
            ]
        }).then( sliders => {
            
            return res.status(200).send({msg:'done',status:'200', data: sliders});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    }else{
        //if user loged in :: slider profile not appear to user
        models.Slider.findAll({
            where: { is_publish:1,[Op.or]:[{finished_at: { [Op.gte] : new Date() }},{finished_at:null}],object_type : {[Op.notIn] :[7] }  } ,
            attributes:[
                ['title_'+language_code, 'title'],['sub_title_'+language_code, 'sub_title'],
                ['image_'+language_code, 'image'],'id','object_id','object_type','external_link'
            ],
            limit: 5,
            order: [
                ['created_at', 'desc']
            ]
        }).then( sliders => {
            
            return res.status(200).send({msg:'done',status:'200', data: sliders});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    }

}/** list slider for home page **/

api.get_page_title = (req, res) => { 
    /*
      page_id :: 
      1 == > Home Page
      2 == > project details
      3 == > All News
      4 == > News Details
      5 == > All Videos
      6 == > profile
      7 == > Registration
    */
    let language_code               = req.language;
    let page_id                     = req.body.page_id;

    let user                        = req.user;
    let msg                         = "";
    let check_attributes            = page_id;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    if (! (['1','2','3','4','5','6','7','8','9'].includes(page_id))) return res.status(453).send({msg:'invalid_page',status:'453'});
    models.PageTitle.findAll({ 
        where: { page_id:page_id } ,
        attributes:[
           'key',
           ['title_'+language_code, 'name'],
        ],
    }).then( sliders => {
        return res.status(200).send({msg:'done',status:'200', data: sliders});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/** Get page title by id **/

api.list_cities = (req, res) => { 
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    models.City.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id',
        ],
        limit:10,
    }).then( cities => {
        return res.status(200).send({msg:'done',status:'200', data: cities});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}

api.list_areas = (req, res) => { 
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    models.Area.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id',
        ],
        limit:10,
    }).then( areas => {
        return res.status(200).send({msg:'done',status:'200', data: areas});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}

api.list_subjects = (req, res) => { 
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    models.Subject.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id',
        ]
    }).then( subjects => {
        return res.status(200).send({msg:'done',status:'200', data: subjects});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}

api.list_jobs = (req, res) => { 
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    models.JobTitle.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id',
        ]
    }).then( subjects => {
        return res.status(200).send({msg:'done',status:'200', data: subjects});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}

api.get_recruitment_data = (req, res) => { 
    language_code = req.language;
    models.Setting.findAll({where:{
        key : {[Op.in]:["recruitment_title","recruitment_description","recruitment_image"]}
    }}).then(about => {
        let data = { 
            "recruitment_title"          : "",
            "recruitment_description"    : "",
            "recruitment_image"          : "",
        };
        if (about) {
            for (let i = 0, len = about.length; i < len; i++) {
                let value = "";

                if ( (['recruitment_description','recruitment_title'].includes(about[i].key ))) {
                    if (language_code == "ar") {
                        value = about[i].value_ar;
                    }else{
                        value = about[i].value;
                    }
                }else if ( (['recruitment_image'].includes(about[i].key ))) {
                    if (about[i].value != "") {
                        value = basicPathImage+"about/" + about[i].value;
                    }
                }else{
                    value =about[i].value;
                }

                let key =about[i].key;
                data[key] = value;
            }
        }
        return  res.status(200).send({msg:'done',status:'200',data: data});
    }).catch(error => {
        return res.status(500).send({msg:error.message,status:'500'});
    });
    
};/* get about data */


api.upload_cv = (req,res) => {
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let job_id                      = req.body.job_id;
    let name                        = req.body.name;
    let mobile                      = req.body.mobile;
    let email                       = req.body.email;
    let cv_file                       = req.body.cv_file;
    let user                        = req.user;
    let msg                         = "";
    let language_code               = req.language;
    let check_attributes =   name && mobile  && job_id && cv_file ;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    let object_id = 0;
    if (user) {
        object_id = user.id;
    }
    //check if message type exist or not 
    models.Recruitment.create({
        name                    : name ,
        mobile                  : mobile ,
        email                   : email ,
        job_id                  : job_id ,
        status                  : 0,
        object_id               : object_id,

    }).then(recruitment => {
        if ( cv_file ) {
            //data:application/pdf;base64,
            if (cv_file.includes('data:application/')) {
                type            = cv_file.split(';')[0].split('/')[1];
                image_base64    = cv_file.split('base64,')[1];

            }else{
                type            = 'pdf';
                image_base64    = cv_file;
            }
            
            const image_name    = mobile+"-"+job_id+generateRandomInt(4)+"."+type;
            const image_path    = "../public_html/jadeertest/public/images/cvs/"+image_name;

            require("fs").writeFile(image_path, image_base64,'base64', function(err) {
                recruitment.cv_file      = image_name;
            });
            recruitment.cv_file          = image_name;

            recruitment.save().then(update_data => {
                msg = langString[language_code].cv_upload_done;
                return res.status(200).send({msg:msg,status:'200'});

            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

        }else{
            msg = langString[language_code].cv_upload_done;
            return res.status(200).send({msg:msg,status:'200'});
        }
    
        
        

    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    
};//send_feedback

api.list_news = (req, res) => { 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;

    let user                        = req.user;
    let msg                         = "";    
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);

    
    models.Article.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
            ['sub_title_'+language_code, 'sub_title'],
            ['title_'+language_code, 'name'],'id','image','created_at','added_at'
        ],
        offset: offset, limit: take,
        order: [
            ['featured', 'desc'],['created_at', 'desc']
            
        ]
    }).then( articles => {
        const promises = [];
        if (articles.length > 0) {

            articles.forEach(article => {
                const promise1 = formatDateHuman(article.get('created_at'),language_code).then(formated_date =>{
                    article.added_at = formated_date;
                    if ((article.name) != null && language_code == "ar") {
                        article.name = (article.name).toArabicDigits();
                    }
                });
                promises.push(promise1);
            })
        }
        Promise.all(promises).then(results => {
            return res.status(200).send({msg:'done',status:'200', data: articles});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}

api.get_news_by_id = (req, res) => { 

    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let article_id                  = req.body.article_id;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";    
    /*check if all required attributes sent */
    let check_attributes            = article_id;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    article_id                      = parseInt(article_id);
    models.Article.findOne({ 
        where: { is_publish:1,id:article_id } ,
        attributes:[
           ['title_'+language_code, 'name'],'id','image','created_at','added_at', ['description_'+language_code, 'description'],
        ],
    }).then( article => {
        if (! article) {
            msg = langString[language_code].article_not_found;
            return res.status(419).send({msg:msg,status:'419'});
        }
        const promises = [];

        const promise1 = formatDateHuman(article.get('created_at'),language_code).then(formated_date =>{
            article.added_at = formated_date;
        });
        promises.push(promise1);
        Promise.all(promises).then(results => {
            if ((article.description) != null && language_code == "ar") {
                article.description = (article.description).toArabicDigits();
            }
            if ((article.name) != null && language_code == "ar") {
                article.name = (article.name).toArabicDigits();
            }
            return res.status(200).send({msg:'done',status:'200', data: article});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});  
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}

String.prototype.toArabicDigits = function(){
    var id = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return this.replace(/[0-9]/g, function(w){
      return id[+w];
     });

};

api.list_media_centers = (req, res) => { 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;

    let user                        = req.user;
    let msg                         = "";    
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.MediaCenter.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id','youtube_link','image','created_at','added_at'
        ],
        offset: offset, limit: take,
        order: [
            ['featured', 'desc'],['created_at', 'desc']
            
        ],
    }).then( media_centers => {
        const promises = [];
        if (media_centers.length > 0) {
            media_centers.forEach(video => {
                const promise1 = formatDateHuman(video.get('created_at'),language_code).then(formated_date =>{
                    video.added_at = formated_date;
                    if ((video.name) != null && language_code == "ar") {
                        video.name = (video.name).toArabicDigits();
                    }
                });
                promises.push(promise1);
            })
        }
        Promise.all(promises).then(results => {
            
            return res.status(200).send({msg:'done',status:'200', data: media_centers});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}; //list_media_centers

api.import_contact  = (req, res) => { 

    let user                        = req.user;
    let msg                         = "";
    let language_code               = req.language;
    let contacts                    = req.body.contacts;
    let check_attributes            = contacts ;
    let contacts_array              = [];
    Array.prototype.isArray         = true;

    
    if (! contacts.isArray ) {
        contacts = JSON.parse(contacts);
    }
    
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    if (! contacts.isArray) return res.status(481).send({msg:'contacts_must_be_array',status:'481'});

    msg = langString[language_code].max_contact_30;
    if (contacts.length > 30) return res.status(482).send({msg:msg,status:'482'});
    msg = langString[language_code].min_contact_1;
    if (contacts.length < 1) return res.status(482).send({msg:msg,status:'482'});
    const promises = [];
    contacts.forEach(contact=>{
        if (contact.mobile != "") {
            contact_obj = {
                user_id         : user.id,
                mobile          : contact.mobile,
                phone1          : contact.phone1,
                phone2          : contact.phone2,
                first_name      : contact.first_name,
                last_name       : contact.last_name,
                name            : contact.first_name+' '+contact.last_name,
            }
            const promise1 = create_new_contact(contact_obj ).then(created_row =>{

            });
            promises.push(promise1);
        }
    });
    Promise.all(promises).then(results => {
        msg = langString[language_code].contact_imported;
        return res.status(200).send({msg:msg,status:'200',data:{msg:msg} });
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

};/*update language*/

create_new_contact= (contact_obj) => {
    return new Promise((resolve, reject) => {
        models.ImportedContact.findOne({ 
            where:{ 
                user_id: contact_obj.user_id ,
                mobile : contact_obj.mobile
            }})
        .then(contact_created => {
            if (contact_created) {
              
                contact_created.first_name        = contact_obj.first_name;
                contact_created.last_name         = contact_obj.last_name;
                contact_created.name              = contact_obj.name;
                contact_created.phone1            = contact_obj.phone1;
                contact_created.phone2            = contact_obj.phone2;
                contact_created.save().then(user_device_saved => {
                    resolve(contact_created);
                }).catch(error => {resolve(error);});

            }else{
               
                models.ImportedContact.create({ 
                    user_id         : contact_obj.user_id ,
                    mobile          : contact_obj.mobile,
                    first_name      : contact_obj.first_name,
                    last_name       : contact_obj.last_name,
                    name            : contact_obj.name,
                    phone1          : contact_obj.phone1,
                    phone2          : contact_obj.phone2,
                })
                .then(contact_created => {
                    resolve(contact_created);
                 }).catch(error => {resolve(error);});
            }
        }).catch(error => {resolve(error);});
    });
}

api.get_user_progress = (req, res) => { 
    let user                        = req.user;
    let language_code               = req.language;
    let progress = [];
    models.UserUnit.findAll({ 
        where: { user_id: user.id } ,
        order: [
            ['created_at', 'desc']
        ],
        include : [{
            model: models.ProjectUnit,
            as :"project_unit",
            
        }],
    }).then( user_units => {
        const promises1 = [];
        let titles      = [];
        let progress_title = "";
        let payment_title = "";
        let next_payment_title = "";
        const promiss1_1 = get_page_customer_title(7,language_code)
        .then(return_titles =>{
            titles = return_titles;
            if (titles.length >0) {
                titles.forEach(title=>{
                    
                    if (title.key == 'next_payment') {

                        next_payment_title = title.name;
                    }
                    if (title.key == 'payments') {

                        payment_title = title.name;
                    }
                    if (title.key == 'progress') {

                        progress_title = title.name;
                    }
                    
                });
            }
        });
        promises1.push(promiss1_1)
        Promise.all(promises1).then(results => {
            const promises = [];

            if(user_units.length > 0){

                user_units.forEach(user_unit =>{
                    //get unit project title // progress
                    let unit = { 
                        "name": " ",
                        "type"                  : "",
                        "no_paid_payments"      : "",
                        "all_payments"          : "",
                        "progress"              : "",
                        "days"                  : 0,
                        "payment_title"         : payment_title,
                        "progress_title"        : progress_title,
                        "next_payment_title"    : next_payment_title,
                    };

                    
                    const promise1 = get_project_name(user_unit.project_id,language_code).then(name =>{
                        unit.name = name;
                    });
                    promises.push(promise1);
                    const promise2 = get_unit_type(user_unit.unit_id,language_code).then(type =>{
                        unit.type = type;
                    });
                    promises.push(promise2);
                    const promise3 = get_no_paid_payments(user_unit.id,user.id).then(no_paid_payments =>{
                        unit.no_paid_payments = no_paid_payments;
                        
                    });
                    promises.push(promise3);
                    const promise4 = get_all_payments(user_unit.id,user.id).then(all_payments =>{
                        unit.all_payments = all_payments;
                        
                    });
                    promises.push(promise4);
                    const promise6 = get_days(user_unit.id,user.id).then(days =>{
                        unit.days = days;
                    });
                    promises.push(promise6);

                    progress.push(unit)
                     
                });
            }
            Promise.all(promises).then(results => {
                if(progress.length > 0){
                    progress.forEach(unit =>{
                        no_paid_payments = unit.no_paid_payments;
                        all_payments = unit.all_payments;
                        if (unit.no_paid_payments == " ") {
                            no_paid_payments = 0;
                        }else{
                            no_paid_payments = parseInt(unit.no_paid_payments);
                        }
                        if (unit.all_payments == " ") {
                            all_payments = 0;
                        }else{
                            all_payments = parseInt(unit.all_payments);
                        }
                        if (all_payments == 0) {
                            
                            unit.progress = Math.ceil(no_paid_payments );
                        }else{
                            unit.progress = no_paid_payments / all_payments * 100 ;
                            unit.progress = Math.ceil(unit.progress);
                        }

                        unit.progress = (unit.progress).toString();
                        unit.no_paid_payments = (unit.no_paid_payments).toString();
                        unit.all_payments = (unit.all_payments).toString();
                        unit.progress = (unit.progress).toString();
                        if (language_code == 'ar') 
                        {
                            unit.no_paid_payments = (unit.no_paid_payments).toArabicDigits();
                            unit.progress = (unit.progress).toArabicDigits();
                            unit.all_payments = (unit.all_payments).toArabicDigits();
                            

                        }
                        
                    });
                }
                return res.status(200).send({msg:'done',status:'200', data: progress});
            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});}); 
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});}); 

    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

};/*get_user_progress*/

api.payment_amount = (req, res) => { 
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    
    /** status 1 for progress & 2 for sold out*/
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.UserUnit.findAll({ 
        where: { user_id : user.id } ,
        attributes : ['id','total_price','down_payment','no_month','remain_payment'],
        offset: offset, limit: take,
        order: [['id', 'DESC']],
    }).then( data => {
  
        const promises = [];
        (data).forEach(project => {
            const promise1 = models.Payment.getRemainPayment(project.id,project.total_price).then(remain_payment =>{
                project.remain_payment = remain_payment;
            });
            promises.push(promise1);
            
        })
        Promise.all(promises).then(results => {


            return res.status(200).send({msg:'done',status:'200', data: data});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

        
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* payment_amount */

api.list_user_units = (req, res) => {   
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    
    /** status 1 for progress & 2 for sold out*/
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.UserUnit.findAll({ 
        where: { user_id : user.id } ,
        attributes : ['id','total_price','down_payment','no_month','remain_payment'],
        include : [{
            model: models.Project,
            as :"project",
            attributes:[
               ['title_'+language_code, 'name'],'id',
               ['image_'+language_code, 'image'],
               ['progress_status','progress_percentage'],
               ['address_'+language_code, 'address'],
               ['progress_text_'+language_code, 'progress_text'],
               'is_favorite'
            ],
            include : [{
                model: models.City,
                as :"city",
                attributes:[
                   ['title_'+language_code, 'name'],
                ],
            }],
        },
        {
            model: models.Unit,
            as :"unit",
            attributes:[
               ['title_'+language_code, 'name'],'id','image','specification_image','area','is_favorite'
            ],
            include : [{
              model: models.UnitSpecification,
              as :"specifications",
              attributes:[
                 ['title_'+language_code, 'name'],
                 ['dimension_'+language_code, 'dimension'],
              ],
              
            }],
        }],
        offset: offset, limit: take,
        order: [['id', 'DESC']],
    }).then( projects => {
        if (projects.length > 0) {
            projects.forEach( user_unit => {

                if (! user_unit.project.name) user_unit.project.name                              = "";
                if (! user_unit.project.address) user_unit.project.address                        = "";
                if (! user_unit.project.progress_text) user_unit.project.progress_text            = "";
                if (! user_unit.project.progress_percentage) user_unit.project.progress_percentage            = 0;

             /*   if(  user_unit.project.image )
                {
                  user_unit.project.image = basicPathImage+"projects/" + user_unit.project.image;
                }else{
                  user_unit.project.image ="";
                }

                if (! user_unit.unit.name) user_unit.unit.name                              = "";
                if(  user_unit.unit.image )
                {
                  user_unit.unit.image = basicPathImage+"units/" + user_unit.unit.image;
                }else{
                  user_unit.unit.image ="";
                }
                if(  user_unit.unit.specification_image )
                {
                  user_unit.unit.specification_image = basicPathImage+"units/" + user_unit.unit.specification_image;
                }else{
                  user_unit.unit.specification_image ="";
                }
                */
                if (language_code == 'ar') {
                    if (! user_unit.unit.area){ user_unit.unit.area      = "" }else{ user_unit.unit.area = (user_unit.unit.area ).toArabicDigits()}
                }else{

                    if (! user_unit.unit.area){ user_unit.unit.area      = "" }
                }
            })
        }

        models.PageTitle.findAll({ 
            where: { key:['progress_title','sub_progress_title']} ,
            attributes:[
               'key',
               ['title_'+language_code, 'name']
            ],  
        }).then( titles => {
            
            const promises = [];
            (projects).forEach(project => {
                const promise3 = models.Payment.getRemainPayment(project.id,project.total_price).then(remain_payment =>{
                    remain_payment = Math.round(remain_payment);

                    project.remain_payment = remain_payment;
                });
                promises.push(promise3);
                if(project.unit){
                    

                    const promise1 = models.WishList.getIsFavorits(project.unit.id,user,2).then(user_fav =>{
                        project.unit.is_favorite = user_fav;
                    });
                    promises.push(promise1);
                }

                if(project.project){
                    const promise2 = models.WishList.getIsFavorits(project.project.id,user,1).then(user_fav =>{
                        project.project.is_favorite = user_fav;
                    });
                    promises.push(promise2);
                }

            })

            Promise.all(promises).then(results => {
                return res.status(200).send({msg:'done',status:'200', data: {projects:projects,titles:titles}});
            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});


        }).catch(error => {reject(error)}); 
        
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* list_user_units */

api.list_user_payments = (req, res) => {   
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    /** status 1 for progress & 2 for sold out*/
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes) return res.status(452).send({msg:'missing_data',status:'452'});
    take                            = parseInt(take);
    offset                          = parseInt(offset);
    models.Payment.findAll({ 
        where: { user_id : user.id , 
            

            [Op.or]: [
            {
                due_date : {[Op.gte]:new Date()},
                status : 1,
            }, 
            {
                status:[0,1,2,3] , 
                due_date : {[Op.lte]:new Date()},
            }
            ]

            } ,
        attributes:[
           'date','id', 'due_date','payment_status','is_lated','amount','payment_date','duedate','status'
        ],
        offset: offset, limit: take,
        order: [['due_date', 'DESC']],
    }).then( history => {
        const promises = [];
        if (history.length > 0) {

            history.forEach(history_obj=>{
                if (language_code == 'ar') {
                    history_obj.amount = ((history_obj.amount).toString()).toArabicDigits();
                }else{
                    history_obj.amount =(history_obj.amount).toString();
                }
                if ( history_obj.due_date != null ) {
                    if (language_code == 'ar') {
                        history_obj.duedate = date.format(new Date(history_obj.due_date), 'YY/MM/DD');
                        history_obj.duedate = (history_obj.duedate).toArabicDigits();
                    }else{
                        history_obj.duedate = date.format(new Date(history_obj.due_date), 'DD/MM/YY');
                    }
                    
                }
              
                if ( history_obj.date != null && history_obj.date != "-" ) {
    
                    if (language_code == 'ar') {
                        history_obj.payment_date = date.format(new Date(history_obj.date), 'YY/MM/DD');
                        history_obj.payment_date = (history_obj.payment_date).toArabicDigits();
                    }else{
                        history_obj.payment_date = date.format(new Date(history_obj.date), 'DD/MM/YY');
                    }

                }

                if (history_obj.payment_date == "") {
                    history_obj.payment_date = "-";
                }

                if (history_obj.payment_date == null) {
                    history_obj.payment_date = "-";
                }

                if (history_obj.status == 0 && ( (new Date()).getTime()  > (new Date(history_obj.due_date) ).getTime() ) ) {
                    const promise1 = translate_payment_status(4,language_code).then(formated_status =>{
                        history_obj.payment_status = formated_status;
                        history_obj.is_lated       = 1;
                    });
                    promises.push(promise1);
                }else{
                    const promise = translate_payment_status(history_obj.status,language_code).then(formated_status =>{
                       
                        history_obj.payment_status = formated_status;

                    });
                    promises.push(promise);
                }

            })
            
        }
        Promise.all(promises).then(results => {   
            console.log(new Date(((new Date().getMonth()+1)%12 + 1) +"-"+ '1-'+ (new Date().getFullYear()) ))        
            models.Payment.findAll({ 
                where: {  
                    user_id:user.id,status:[0 ,3],

                    due_date: {
                      [Op.gte]: new Date(),
                      [Op.lt]: new Date(((new Date().getMonth()+1)%12 + 1) +"-"+ '1-'+ (new Date().getFullYear()) )
                    }

                 } ,
                attributes:[
                   'date','id', 'due_date','payment_status','is_lated','amount','payment_date','duedate','status'
                ], 
                order: [
                    ['due_date', 'ASC']
                ],
            }).then( next_payments => {


                const promises1 = [];
                next_payments.forEach(next_payment=>{
                    if (next_payment) {
                        if (language_code == 'ar') {
                            next_payment.amount = ((next_payment.amount).toString()).toArabicDigits();
                        }else{
                            next_payment.amount =(next_payment.amount).toString();
                        }
                        if ( next_payment.due_date != null ) {
                            if (language_code == 'ar') {
                                next_payment.duedate = date.format(new Date(next_payment.due_date), 'YY/MM/DD');
                                next_payment.duedate = (next_payment.duedate).toArabicDigits();
                            }else{
                                next_payment.duedate = date.format(new Date(next_payment.due_date), 'DD/MM/YY');
                            }
                            
                        }
                      
                        if ( next_payment.date != null ) {
                            if (language_code == 'ar') {
                                next_payment.payment_date = date.format(new Date(next_payment.date), 'YY/MM/DD');
                                next_payment.payment_date = (next_payment.payment_date).toArabicDigits();
                            }else{
                                next_payment.payment_date = date.format(new Date(next_payment.date), 'DD/MM/YY');
                            }
                        }

                        if (next_payment.payment_date == "") {
                            next_payment.payment_date = "-";
                        }

                        if (next_payment.payment_date == null) {
                            next_payment.payment_date = "-";
                        }


                        if (next_payment.status == 0 && ( (new Date()).getTime()  > (new Date(next_payment.due_date) ).getTime() ) ) {

                            const promise1 = translate_payment_status(4,language_code).then(formated_status =>{
                                next_payment.payment_status = formated_status;
                                next_payment.is_lated       = 1;
                                
                            });
                            promises1.push(promise1);

                        }else{
                            const promise1 = translate_payment_status(next_payment.status,language_code).then(formated_status =>{
                                next_payment.payment_status = formated_status;
                            });
                            promises1.push(promise1);
                        }
                    }
                });

                Promise.all(promises1).then(results => {

                    return res.status(200).send({msg:'done',status:'200', data: {history : history ,next_payment:next_payments }});

                }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* list_user_payments */

/* postpone_payment */
api.postpone_payment = (req, res) => {  
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let user                        = req.user;
    let msg                         = "";
    let language_code               = req.language;
    
    var d = new Date();
    var local = d.getTime();
    var offset = d.getTimezoneOffset() * (60 * 1000);
    var utc = new Date(local + offset);
    var riyadh = new Date(utc.getTime() );
    riyadh = date.format(new Date(riyadh),'YYYY-MM-DD HH:mm:ss');
    let added_time = new Date(riyadh).getTime().toString();

    models.Postpone.create({
        user_id                     : user.id,
        postpone_at                 : added_time,
        status                      : 0
    }).then(postpone => {
        msg = langString[language_code].postpone_done;
        return res.status(200).send({msg:msg,status:'200',data:{msg:msg}});

    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* postpone_payment */

api.calculate_decore_price = (req, res) => {  
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let user                        = req.user;
    let meter_no                    = req.body.meter_no;
    let type_id                    = req.body.type_id;
    let msg                         = "";
    let language_code               = req.language;

    models.DecoreType.findOne({
       where:{ id                     : type_id}
    }).then(decore_type => {
        let price = 0;
        
        if (! decore_type) {
            msg = langString[language_code].decore_type_not_found;
            return res.status(419).send({msg:msg,status:'419'});
        }
        
        price = decore_type.price * parseFloat(meter_no);
        
        msg = 'Done';
        return res.status(200).send({msg:msg,status:'200',data:{msg:msg,price:price,meter_price:parseFloat(decore_type.price)}});

    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* calculate_decore_price */

api.request_decore = (req, res) => {  
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let user                        = req.user;
    let msg                         = "";
    let language_code               = req.language;
    models.DecoreRequest.create({
        user_id                     : user.id,
        status                      : 0
    }).then(postpone => {
        msg = langString[language_code].decore_done;
        return res.status(200).send({msg:msg,status:'200',data:{msg:msg}});

    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* request_decore */

api.list_decore_types = (req, res) => { 
    let language_code               = req.language;
    let user                        = req.user;
    let msg                         = "";
    models.DecoreType.findAll({ 
        where: { is_publish:1 } ,
        attributes:[
           ['title_'+language_code, 'name'],'id',
        ],
        limit:10,
    }).then( subjects => {
        //decoration_number
        models.Setting.findAll({where:{
        key : {[Op.in]:["decoration_number"]}
    }}).then(about => {
        let data = { 
            "decoration_number"   : ""
        };
        if (about) {
            for (let i = 0, len = about.length; i < len; i++) {
                let value   = "";
                value       = about[i].value;
                let key     = about[i].key;
                data[key]   = value;
            }
        }
        return res.status(200).send({msg:'done',status:'200', data: {subjects:subjects,decoration_number:data["decoration_number"]} });
    }).catch(error => {
        return res.status(500).send({msg:error.message,status:'500'});
    });
        
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

}/* list_decore_types */

api.list_user_wishlist = (req, res) => { 

    if(! req.body)                  return res.status(452).send({msg:'missing_data',status:'452'});
    let take                        = req.body.take;
    let offset                      = req.body.offset;
    let language_code               = req.language;

    let user                        = req.user;
    let msg                         = "";
    
    /*check if all required attributes sent */
    let check_attributes            = offset && take;
    if (! check_attributes)         return res.status(452).send({msg:'missing_data',status:'452'});

    take                            = parseInt(take);
    offset                          = parseInt(offset);

    models.WishList.findAll({
        where: { user_id: user.id } ,
        offset: offset, 
        limit: take,
        order: [['created_at', 'DESC']],
        attributes : ['id','object_id','object_type']
    }).then( favorites => {
        let wishLists   = [];
        const promises  = [];
        favorites.forEach(object_data => {
            
            if (object_data.object_type == 1) {
                // project 
                const promise1 = models.Project.getProductData(object_data.object_id,language_code).then(user_fav =>{
                    if (user_fav) {
                        user_fav.is_favorite            = 1;
                        user_fav.object_type            = object_data.object_type;
                        user_fav.object_id              = object_data.object_id;
                        user_fav.project_title          = "";

                        wishLists.push(user_fav);
                    }
                });
                promises.push(promise1);
             
            }else{
                const promise1 = models.Unit.getUnitData(object_data.object_id,language_code).then(user_fav =>{
                    if (user_fav) {
                        user_fav.is_favorite            = 1;
                        user_fav.object_type            = object_data.object_type;
                        user_fav.object_id              = object_data.object_id;
                        user_fav.project_title          = "";
                        wishLists.push(user_fav);
                    }

                });
                promises.push(promise1);
            }
        })
        Promise.all(promises).then(results => {
        const promises2  = [];

            wishLists.forEach(object_data => {
            
                if (object_data.object_type == 2) {
                    // project 
                    const promise2 = models.Project.getProductData(object_data.project_id,language_code).then(project =>{
                        if (project) {

                            object_data.project_title          = project.get('name');
                        }
                    });
                    promises2.push(promise2);
                 
                }

            })
            Promise.all(promises2).then(results => {

                return res.status(200).send({msg:'done',status:'200', data: wishLists});
            
            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});   
        }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});   
    }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});    

};/* list user favorites For Logged User */

api.add_to_wishlist = async (req, res) => { 
    if(! req.body) return res.status(452).send({msg:'missing_data',status:'452'});
    let msg                         = "";
    let object_id                   = req.body.object_id;
    let object_type                 = req.body.object_type;

    let user                        = req.user;
    let language_code               = req.language;

    /*check if all required attributes sent */
    let check_attributes            =  object_id && object_type;
    
    if (! check_attributes)         return res.status(452).send({msg:'missing_data',status:'452'});

    let objectData = null;
    if (object_type == 1) {
        // project 
        objectData = await models.Project.findOne({where: { id : object_id } });
        if (! objectData) {
            msg = langString[language_code].project_not_found;
            return  res.status(404).send({msg:msg,status:'404'});

        }
    }else{
        objectData = await models.Unit.findOne({where: { id : object_id } });
        if (! objectData) {
            msg = langString[language_code].unit_not_found;
            return  res.status(404).send({msg:msg,status:'404'});

        }
    }

    models.WishList.findOne({
        where: { object_id             : object_id, user_id: user.id,object_type:object_type } 
    }).then( objectCheck => {
        if (! objectCheck) {   
            // create product favorites
            models.WishList.create({
                user_id             : user.id,
                object_id           : object_id,
                object_type         : object_type, 
                created_at          : new Date() ,
                updated_at          : new Date() 
            }).then(object_favorite => {
                
                if (object_type == 1) {
                    // project 
                    msg                 = langString[language_code].project_favorite;
                }else{
                    msg                 = langString[language_code].unit_favorite;

                }
                return res.status(200).send({msg:msg,status:'200'});

            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});

        }else{
            //*   delete product*/
            objectCheck.destroy().then(data => {

                if (object_type == 1) {
                    // project 
                    msg                 = langString[language_code].project_unfavorite;
                }else{
                    msg                 = langString[language_code].unit_unfavorite;
                }
                return  res.status(201).send({msg:msg,status:'201'});

            }).catch(error => {return res.status(500).send({msg:error.message,status:'500'});});
        }
    });

};/*favourite and un favourite products by logged user*/

api.empty_wishlist = (req, res) => { 
    let user                        = req.user;
    let msg                         = "";
    
    let language_code               = req.language;
    
    models.WishList.destroy({
        where: {  user_id: user.id } 
    }).then( offer => {
        msg = langString[language_code].favorite_deleted;
        return  res.status(200).send({msg:msg,status:'200'});
    }).catch(error => {
        return res.status(500).send({msg:error.message,status:'500'});
    });  

};/* delete all favorites*/

get_no_paid_payments = (unit_id,user_id) => {
    return new Promise((resolve, reject) => {
        if(unit_id != "" && unit_id != null && user_id != "" && user_id != null){
            models.Payment.count({ 
                where: { unit_user_id:unit_id, user_id:user_id,status:[1,2]} ,  
            }).then( payments => {
                resolve(payments);
            }).catch(error => {reject(error)}); 
        }else{
            resolve("0");
        }
    });

};

get_page_customer_title = (page_id,language_code) => {
    return new Promise((resolve, reject) => {
        models.PageTitle.findAll({ 
            where: { page_id:page_id} ,
            attributes:[
               'key',
               ['title_'+language_code, 'name'],
            ],  
        }).then( titles => {
            resolve(titles);
        }).catch(error => {reject(error)}); 
       
    });

};

get_all_payments = (unit_id,user_id) => {
    return new Promise((resolve, reject) => {
        if(unit_id != "" && unit_id != null && user_id != "" && user_id != null){
            models.Payment.count({ 
                where: { unit_user_id:unit_id, user_id:user_id} ,  
            }).then( payments => {
                resolve(payments);
            }).catch(error => {reject(error)}); 
        }else{
            resolve("0");
        }
    });

};

get_days = (unit_id,user_id) => {
    return new Promise((resolve, reject) => {
        if(unit_id != "" && unit_id != null && user_id != "" && user_id != null){
            models.Payment.findOne({ 
                where: { unit_user_id:unit_id, user_id:user_id,status:0} ,  
                order: [
                    ['due_date', 'ASC']
                ],
            }).then( payment => {

                if ( payment == null) {
                    resolve(0);
                }else{

                    if (payment.due_date != null) {
                        var d                   = new Date();
                        var local               = d.getTime();
                        var offset              = d.getTimezoneOffset() * (60 * 1000);
                        var utc                 = new Date(local + offset);
                        var cairoNow             = new Date(utc.getTime() + (2 * 60 * 60 * 1000));
                        cairoNow                 = date.format(new Date(cairoNow),'YYYY-MM-DD');
                        due_date                 = date.format(new Date(payment.due_date),'YYYY-MM-DD');
                        let days = date.subtract( new Date(due_date),new Date(cairoNow) ).toDays();
                       // resolve(days+2);
                        resolve(days);
                    }
                    resolve(0);
                }
                
            }).catch(error => {reject(error)}); 
        }else{
            resolve(0);
        }
    });

};

get_project_name= (project_id,language_code) => {
    return new Promise((resolve, reject) => {
        if(project_id != "" && project_id != null){
            models.Project.findOne({ 
                where: { id:project_id } ,
                attributes:[
                   ['title_'+language_code, 'name'],'id'
                ],
            }).then( project => {
                if (! project) {
                    resolve("");
                }
                resolve(project.get('name'));
            }).catch(error => {reject(error)}); 
        }else{
            resolve("");
        }
    });

};

get_unit_type= (unit_id,language_code) => {
    return new Promise((resolve, reject) => {
        if(unit_id != "" && unit_id != null){
             models.Unit.findOne({ 
                where: { id:unit_id } ,
                attributes:[
                   ['title_'+language_code, 'name'],'id',
                ],
            }).then( unit_data => {
                if (unit_data == null) {
                    resolve("");
                }else{
                   resolve(unit_data.name); 
                }
                
            }).catch(error => {reject(error)}); 
        }else{
            resolve("");
        }
    });

};

formatDateHuman = (created_at, lang) => {
    return new Promise((resolve, reject) => {
        if(created_at != "" && created_at != null){
            let moment = require('moment');
            let formated = "";
            if (lang == 'ar') {
                moment.locale(lang);
                formated =  moment(created_at).format('الddd DD MMM, YYYY');
            }else{
               moment.locale(lang);
                formated = moment(created_at).format('ddd MMM DD, YYYY'); 
            }

            moment.locale('en');
            resolve(formated);

        }else{
            resolve("");
        }
    });

}; /* formatDateHuman */

translate_payment_status = (type,lang) =>{
    return new Promise((resolve, reject) => {
      switch (type) {
        case 0:
            resolve('-');
            break;
          case 1:
            resolve(langString[lang].paid);
            break;
          case 2:
            resolve(langString[lang].paid_late);
            break;
          case 3:
            resolve(langString[lang].postpone);
            break;
          case 4:
            resolve(langString[lang].late);
            break;  
        }
    }); 

}
const generateRandomInt = (n) => {
    let add = 1, max = 12 - add;   

    if ( n > max ) {
        return generate(max) + generate(n - max);
    }
    max                             = Math.pow(10, n+add);
    let min                         = max/10; // Math.pow(10, n) basically
    let number                      = Math.floor( Math.random() * (max - min + 1) ) + min;

    return  ("" + number).substring(add); 

}/**generateRandomInt */

module.exports = api;