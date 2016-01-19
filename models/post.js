
// Declare Dependencies

var mongoose = require('mongoose');

// Post Template

var PostSchema = new mongoose.Schema({
	title: String,
	img: {
		type: String,
		required: true
	},
	url: {
		type: String
	},
	dateCreated: Date,
	dateDeleted: {
		type: Date,
		default: null
	},
	userImg: String,
	username: {
		type: String,
		required: true
	},
	hashtag: [String]
});

// Module ready for use

mongoose.model('Post', PostSchema);
