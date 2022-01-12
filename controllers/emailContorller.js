const smsApi = {};

smsApi.sendMail = (email, message, title) => {
  return new Promise((resolve, reject) => {
    const nodeMailer = require("nodemailer");
    //	const sender 	 = "support@digitalwiseonline.com";
    //	const password 	 = "90rJsAVmN5Cz";
    const sender = "noreply.jaqdeer@gmail.com";
    const password = "jaqdeer@2021";

    // 	   	let transporter = nodeMailer.createTransport({
    // 			host: 'mail.digitalwiseonline.com',
    // 			port: 465,
    // 			//  secure: true,
    //         	tls: {
    // 		        rejectUnauthorized:false
    // 		    },
    // 			auth: {
    // 			  user: 'support@digitalwiseonline.com',
    // 			  pass: '90rJsAVmN5Cz'
    // 			}
    // 	    });

    let transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "noreply.jaqdeer@gmail.com",
        pass: "jaqdeer@2021",
      },
    });

    let mailOptions = {
      from: '"Jadder App" <noreply.jaqdeer@gmail.com>', // sender address
      to: email, // list of receivers
      subject: title, // Subject line
      text: "", // plain text body
      html: "<p>" + message + "</p>", // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message %s sent: %s", info.messageId, info.response);
      resolve(true);
    });
  });
};

module.exports = smsApi;
