var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
  // res.render('product_form');
  res.render('product_form');
});



module.exports = router;