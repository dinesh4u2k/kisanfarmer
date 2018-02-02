var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/customer_database');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res){
	res.render('register_customer');
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
	var email = req.body.email;
	var contact_number = req.body.contact_number;
	var password = req.body.password;
	var password2 = req.body.password2;
	var occupation = req.body.occupation;
	var shop_name = req.body.shop_name;
	var street_name =req.body.street_name;
	var city =req.body.city;
	var pincode = req.body.pincode;

	// Validation
	req.checkBody('username', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('contact_number', 'Please enter contact_number').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('occupation', 'occupation required').notEmpty();
	req.checkBody('city', 'city is required').notEmpty();
	req.checkBody('pincode', 'pincode is required').notEmpty();
	

	var errors = req.validationErrors();

	if(errors){
		res.render('register_customer',{
			errors:errors
		});
	} else {
		var newUser = new User({
			username: username,
			password: password,
			email:email,
			contact_number:contact_number,
			occupation:occupation,
			shop_name:shop_name,
			street_name:street_name,
			city:city,
			pincode:pincode
			
		});

		User.createUser(newUser, function(err, customer){
			if(err) throw err;
			console.log(customer);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, customer){
   	if(err) throw err;
   	if(!customer){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, customer.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, customer);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(customer, done) {
  done(null, customer.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, customer) {
    done(err, customer);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/customer/customer_page', failureRedirect:'/customer/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/customer/customer_page');
  });




module.exports = router;
