var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('nithome');
});

router.get('/registration', function(req, res, next) {
  res.render('registration',{});
});

router.get('/forgotpassword', function(req, res, next) {
  res.render('forgotpassword');
});

router.get('/nithome', function(req, res, next) {
  res.render('nithome');
});

router.get('/adminlogin', function(req, res, next) {
  res.render('adminlogin');
});

router.get('/contact1', function(req, res, next) {
  res.render('contact1');
});

router.get('/studentlogin', function(req, res, next) {
  res.render('studentlogin');
});

router.get('/help', function(req, res, next) {
  res.render('help');
});

router.get('/studenthome',function (req, res, next){
  res.render('studenthome');
});

module.exports = router;
