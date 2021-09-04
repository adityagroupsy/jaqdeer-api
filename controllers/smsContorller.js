const smsApi 			= {};

//
smsApi.send_sms 		= (req , res) =>{
	var request = require('request');
	message = req.body.message ;
	mobile  = req.body.mobile ;
	let url 			= 'url';
	let parameters 		= '&numbers='+mobile+'&sender=ziad1434&message='+message;
	url 				= url + parameters;
	    console.log(url);

	request(url, function (error, response, body) {
	  if (! error && response.statusCode == 200) {
	    
	    return res.status(400).send({msg:body});
	  }else{
	  	console.log(body);
	  	return res.status(400).json({msg:error.message});
	  }
	});

}

smsApi.send_sms_by_mobile 		= (message , mobile) =>{
	var request = require('request');
	let url 			= 'url';
	let parameters 		= '&numbers='+mobile+'&sender=ziad1434&message='+message;
	url 				= url + parameters;


	request(url, function (error, response, body) {
	  if (! error && response.statusCode == 200) {
	    
	    return 'true';
	  }else{
	  	console.log(body);
	  	return 'false';
	  }
	});

}
module.exports = smsApi;