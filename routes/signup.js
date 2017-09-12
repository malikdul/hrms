var express = require('express');
var router = express.Router();
var nodemailer= require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("signup loading");
	res.render('signup', { title: 'signup' });
});
	

router.post('/send ', function(req, res, next) {
	console.log('Post function');
	var transporter= nodemailer.createTranport({
		service: 'Gmail',
		auth: {
			user: 'fmalvi12@gmail.com',
			pass: 'farmo@1212'
		}
	});
	var mailOption= {
		from:'Sheeda <sheeda@outlook.com>' ,
		to: req.body.email,
		subject: 'Verification Email',
		text: 'Please click the link below to verify your account www.google.com.pk',
		html: '<p>Please click the link below to verify your account www.google.com.pk</p>'
	};
	
	transporter.sendMail(mailoptions,function(error,info){
		console.log(error);
		if(error){
			console.log(error);
			res.redirect('/');
		}else{
			console.log('Message Sent'+info.response);
			res.redirect('/');
		}
	});
});
module.exports = router;