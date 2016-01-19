
// Declare Dependencies

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var jwt = require('express-jwt');
var router = express.Router();

// Routes

// User Registration Route

router.post('/Register', function(req, res, next) {
	var user = new User();
	user.username = req.body.username;
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.userImg = req.body.userImg;
	user.setPassword(req.body.password);
	user.save(function(err, user) {
		if(err) return next(err);
		res.json({token: user.generateJWT()});
	});
});

// User Login Route
	// Passport Local authentication with JWT

	router.post('/Login', function(req, res, next) {
		if(!req.body.username || !req.body.password) return res.status(400).send('Please complete all fields');
		passport.authenticate('local', function(err, user, info) {
			if(err)  return next(err);
			if(user)  return res.json({token: user.generateJWT()});
			return res.status(400).send(info);
		})(req, res, next);
	});

// Error Handling Function

router.use(function(err, req, res, next) {
	res. status(500).send(err);
});

// Module ready for use

module.exports = router;