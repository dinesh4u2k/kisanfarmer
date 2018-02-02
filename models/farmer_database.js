var mongoose1 = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var CustomerSchema1 = mongoose1.Schema({
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
		type: Number
	},
	street_number: {
		type: String
	},
	street_name: {
		type: String
	},
	city: {
		type: String
	},
	pincode: {
		type: Number
	}


});

var User1 = module.exports = mongoose1.model('User1', CustomerSchema1);

module.exports.createUser = function(newUser1, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser1.password, salt, function(err, hash) {
	        newUser1.password = hash;
	        newUser1.save(callback);
	    });
	});
}

// module.exports.getUserById = function(farmer_id, callback){
// 	var query = {farmer_id: farmer_id};
// 	User1.findOne(query, callback);
// }

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User1.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User1.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}