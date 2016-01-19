
// Declare Dependencies

var express = require('express');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var jwt = require('express-jwt');
var router = express.Router();

var auth = jwt({secret: 'StuffandThings', userProperty: 'payload'});

// Routes

// Post Routes

router.param('post', function(req, res, next, _id) {
	Post.findOne({_id: _id}).exec(function(err, posts) {
		if(err) return next(err);
		req.post = posts;
		next();
	});
});

// Delete Post

router.post('/v1/api/deletePost/:post', function(req, res, next) {
	Post.update({_id : req.post._id}, {dateDeleted: new Date()}, function(err) {
		if(err) return next(err);
		else res.send("You have deleted the Post.");
	});
});

//Gets all post that are not deleted

router.get('/v1/api/Post', function(req, res, next) {
	var query = Post.find({dateDeleted: null});
	query.exec(function(err, posts) {
		if(err) return next(err);
		res.json(posts);
	});
});

//Gets a single post

router.get('/v1/api/Post/:post', function(req, res, next) {
	res.send(req.post);
});

// New Post

router.post('/v1/api/Post', function(req, res, next) {
	var createdPost = new Post(req.body);
	createdPost.dateCreated = new Date();
	createdPost.save(function(err, post) {
		if(err) return next(err);
		res.send({id: post._id});
	});
});

// Comments to Post

// router.post('/v1/api/Post/:post/comment', auth, function(req, res, next) {
// 	var newComment = req.body;
// 	newComment.dateCreated = new Date();
// 	newComment.user = req.payload.id;
// 	Post.update({_id: req.post._id}, {$push: { comments: newComment }}, function(err, numberAffected) {
// 		if(err) return next(err);
// 		Post.findOne({_id: req.post._id}, function(err, post) {
// 			if(err) return next(err);
// 			var comment = post.comments[post.comments.length - 1];
// 			res.send({_id: comment._id, dateCreated: comment.dateCreated});
// 		});
// 	});
// });

// Error Handling Function

router.use(function(err, req, res, next) {
	res.status(400).send(err);
});

// Module ready for use

module.exports = router;
