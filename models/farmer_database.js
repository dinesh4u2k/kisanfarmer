var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var CustomerSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	farmer_id: {
		type: String
	},
	password: {
		type: String
	},
	contact_number: {
		type: String
	},
	street_name: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},


},{collection: 'general'});

var User = module.exports = mongoose.model('User', CustomerSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

// module.exports.getUserById = function(farmer_id, callback){
// 	var query = {farmer_id: farmer_id};
// 	User1.findOne(query, callback);
// }

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}