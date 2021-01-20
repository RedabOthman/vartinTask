var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  next();
});

router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});


router.get('/signup', (req, res, next) => {
	return res.render('signup.ejs');
});

router.get('/profile', (req, res, next) => {
	return res.render('profile.ejs');
});

router.get('/updateUserInfo', (req, res, next) => {
	return res.render('updateUserInfo.ejs');
});

module.exports = router;
