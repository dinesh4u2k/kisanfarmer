var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var TMClient = require('textmagic-rest-client');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// var msg91=require('msg91-sms');
var msg91 = require("msg91")("269201A0ifHNIRcn5c98e97a", "COMEAH", "4" );
var userDataSchema = new Schema({
  farmer_name:String,
  farmer_number:Number,
  farmer_address:String,
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

router.post('/send_msg', function(req, res, next) {




  // var authkey='269201A0ifHNIRcn5c98e97a';
  
   var customer_name=req.body.customer_name;
    var customer_number=req.body.customer_number;
    var customer_address=req.body.customer_address;
    var product_name= req.body.product_name;
    var kg=req.body.kg;
    var farmer_number=req.body.farmer_number;
    var message=customer_name+customer_number+customer_address+product_name+kg;

   
var mobileNo = farmer_number;
 
msg91.send(mobileNo, message, function(err, response){
    console.log(err);
    console.log(response);
});


    res.redirect('/home');
  });


router.post('/insert', function(req, res, next) {
  var item = {
    farmer_name:req.body.farmer_name,
    farmer_number:req.body.farmer_number,
    farmer_address:req.body.farmer_address,
    product_name: req.body.product_name,
    price: req.body.price,
    kg: req.body.kg,
    types: req.body.types,
    date: req.body.date

  };
  
 // console.log(req.body.farmer_number);
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

router.get('/popup', function(req, res, next) {
      res.render('popup');
      
});

router.get('/pass-data/:number', function(req, res, next) {
var number1 = req.params.number;
  // UserData.findOne({'farmer_number':number})
  //     .then(function(doc) {
        res.render('request_form', {items: number1});
      // });
});

// router.get('/get-data1', function(req, res, next) {
//   product = req.body.tomato;
//   UserData.find({'product_name':product})
//       .then(function(doc) {
//         res.render('customer_page', {items: doc});
//       });
// });

router.get('/pumpkin', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'pumpkin'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});

router.get('/peas', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'peas'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});

router.get('/brinjal', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'brinjal'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});

router.get('/tomato', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'tomato'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});

router.get('/onion', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'onion'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/garlic', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'garlic'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/apple', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'apple'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/grape', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'grape'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/orange', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'orange'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/mango', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'mango'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/pappaya', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'pappaya'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/rice', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'rice'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/barley', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'barley'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/buckwheate', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'buckwheat'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/maize', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'maize'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/mustard seeds', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'mustard seeds'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/chickpease', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'chickpease'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/bean broad', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'bean broad'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/red gram', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'red gram'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/black gram', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'black gram'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/red beans', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'red beans'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/milk', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'milk'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/curd', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'curd'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/butter', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'butter'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/cheese', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'cheese'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/custard', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'custard'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/native hen eggs', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'native hen eggs'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/duck eggs', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'duck eggs'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/emu eggs', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'emu eggs'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/ostrich eggs', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'ostrich eggs'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});
router.get('/turkey eggs', function(req, res, next) {
  // product = req.body.tomato;
  UserData.find({'product_name':'turkey eggs'})
      .then(function(doc) {
        res.render('customer_page', {items: doc});
      });
});

router.get('/api', function(req, res, next) {
  // product = req.body.tomato;
  // UserData.find({'product_name':'tomato'})
  //     .then(function(doc) {
        res.render('api');
      // });
});





module.exports = router;
