var express = require('express');
var router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  product_name: {type: String, required: true},
  price: Number,
  kg: Number,
  types: String,
  date: String

},{collection: 'productsdetails'});

var UserData = mongoose.model('UserData', userDataSchema);

var User = require('../models/farmer_database');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kisan Farmer' });
});

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/back', function(req, res) {
  res.render('index');
});

router.get('/product_form', function(req, res, next) {
  // res.render('product_form');
  res.render('product_form');
});

router.get('/customer', function(req, res, next) {
  // res.render('product_form');
  res.render('customer_page');
});
router.get('/map', function(req, res) {
  res.render('map');
});

router.post('/register', function(req, res){
  var username = req.body.Name;
  var farmer_id = req.body.farmer_id;
  var contact_number = req.body.number;
  var password = req.body.password;
  var password1 = req.body.Confirm_Password;
  var street_name =req.body.stname;
  var city =req.body.city;
  var state = req.body.state;

  // Validation
  req.checkBody('username', 'Name is required').notEmpty();
  req.checkBody('farmer_id', 'farmer id is required').notEmpty();
  req.checkBody('contact_number', 'Please enter contact_number').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password1', 'Passwords do not match').equals(req.body.password);
  req.checkBody('state', 'state is required').notEmpty();
  req.checkBody('street_name', 'street_name is required').notEmpty();
  req.checkBody('city', 'city is required').notEmpty();
  
  

  var errors = req.validationErrors();


   
    var newUser = new User({
      username: username,
      farmer_id: farmer_id,
      contact_number:contact_number,
      password:password,
      state:state,
      street_name:street_name,
      city:city
      
      
    });

    User.createUser(newUser, function(err, farmer){
      if(err) throw err;
      console.log(farmer);
    });

    req.flash('success_msg', 'You are registered and can now login');

    res.redirect('/back');
  
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, farmer){
    if(err) throw err;
    if(!farmer){
      return done(null, false, {message: 'Unknown User'});
    }

    User.comparePassword(password, farmer.password, function(err, isMatch){
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
  User.getUserById(id, function(err, farmer) {
    done(err, farmer);
  });
});



router.post('/login', passport.authenticate('local', {successRedirect:'/home', failureRedirect:'/back',failureFlash: true}),
  function(req, res) {
    res.redirect('/home');
});

router.post('/insert', function(req, res, next) {
  var item = {
    product_name: req.body.product_name,
    price: req.body.price,
    kg: req.body.kg,
    types: req.body.types,
    date: req.body.date

  };

  var data = new UserData(item);
  data.save();

  res.redirect('/home');
});


router.get('/get-data', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('product_form', {items: doc});
      });
});

router.get('/get-data1', function(req, res, next) {
  UserData.find()
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});





module.exports = router;
