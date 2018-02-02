var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User1 = require('../models/farmer_database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res){
	res.render('register_farmer');
});

// Login
router.get('/login', function(req, res){
	res.render('login_customer');
});

router.get('/customer_page', function(req, res){
	res.render('customer_page');
});

// Register User
router.post('/register', function(req, res){
	var username = req.body.username;
	var farmer_id = req.body.farmer_id;
	var contact_number = req.body.contact_number;
	var password = req.body.password;
	var password1 = req.body.password1;
	var street_number = req.body.street_number;
	var street_name =req.body.street_name;
	var city =req.body.city;
	var pincode = req.body.pincode;

	// Validation
	req.checkBody('username', 'Name is required').notEmpty();
	req.checkBody('farmer_id', 'farmer id is required').notEmpty();
	req.checkBody('contact_number', 'Please enter contact_number').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password1', 'Passwords do not match').equals(req.body.password);
	req.checkBody('street_number', 'street_number is required').notEmpty();
	req.checkBody('street_name', 'street_name is required').notEmpty();
	req.checkBody('city', 'city is required').notEmpty();
	req.checkBody('pincode', 'pincode is required').notEmpty();
	

	var errors = req.validationErrors();


	if(errors){
		res.render('register_farmer',{
			errors:errors
		});
	} else {
		var newUser1 = new User1({
			username: username,
			farmer_id: farmer_id,
			contact_number:contact_number,
			password:password,
			street_number:street_number,
			street_name:street_name,
			city:city,
			pincode:pincode
			
		});

		User1.createUser(newUser1, function(err, farmer){
			if(err) throw err;
			console.log(farmer);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User1.getUserByUsername(username, function(err, farmer){
   	if(err) throw err;
   	if(!farmer){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User1.comparePassword(password, farmer.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, farmer);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(farmer, done) {
  done(null, farmer.id);
});

passport.deserializeUser(function(id, done) {
  User1.getUserById(id, function(err, farmer) {
    done(err, farmer);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/farmer/farmer_page', failureRedirect:'/farmer/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/customer/farmer_page');
  });




module.exports = router;
