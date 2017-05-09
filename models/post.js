const mongoose = require("mongoose");

const config = require('../config/database');

const PostSchema = mongoose.Schema({
	
	name: {
		type: String,
		required: true
	},

	quest: {
		type: String,
		required: true
	},

	subs: [{

		name: String,
		username: String,
		PDFloc: String
	}],

	Lnumber: {

		type: Number,
		required: true
	}
});

const Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.getPostById = function(id, callback) {

	Post.findById(id, callback);
};

module.exports.getPostByName = function(name, callback) {

	const query = {name: name};
	Post.findOne(query, callback);
};

module.exports.addPost = function(newPost, callback){

	newPost.save(callback);
};
