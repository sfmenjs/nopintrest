
// Declare Dependencies

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Setup Passport Strategy for User login

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({username: username}, function(err, user) {
		if(err) return done(err);
		if(!user) return done(null, false, {message: 'Invalid Username.'});
		if(!user.validatePassword(password)) return done(null, false, {message: 'Invalid password'});
		return done(null, user);
	});
}));