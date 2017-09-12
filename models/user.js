var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/demo');

var db= mongoose.connection;

//User Schema
var UserSchema= mongoose.Schema({
	username: {
		type:  String,
		index: true
	},
	password: {
		type:  String,
		index: true
	},
	email: {
		type:  String
	},
	name: {
		type:  String
	},
	
});

var User = module.exports= mongoose.model('User',UserSchema);

module.exports.creaateUser=function(newUser, callback){
	newUser.save(callback);
}