var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/signup',  function(req, res, next){
	//get form values
	var name = req.body.name;
	var email= req.body.email;
	var username= req.body.username;
	var password= req.body.password;
	var password2= req.body.password2;

	var errors= req.validationErrors();
	 	if (errors){
			res.render('register',{
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
		}else {
			var newUser= new User({
			name: name,
			email: email,
			username: username,
			password: password,
			});
			//Creating User
		User.createUser(newUser, function(err,user){
			if(err) throw err;
			console.log(user);
			});

			//success message
			req.flash('success', 'You are registered');
			res.location('/');
			res.redirect('/');
		}
});
module.exports = router;
