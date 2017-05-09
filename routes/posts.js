const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const fs = require('fs');
const ObjectId = require('mongodb').ObjectID;
const User = require('../models/user');
//Create a new post
router.post('/create', isUserAdmin, function(req, res){


	let newPost = new Post({

		name: req.body.name,
		quest: req.body.quest,
		Lnumber: req.body.Lnumber
	});

	Post.addPost(newPost, function(err, post) {

		if (err) {

			res.json({success: false, msg: 'Failed to add Post'});
		}
		else {

			res.json({success: true, msg: 'Post added'});
		}
	});
});

router.put('/changeLnumber/:postName', isUserAdmin, function(req, res) {

	const postName = req.params.postName;
	approveOrReject = req.body.approveOrReject;

	if (approveOrReject) {

			Post.findOneAndUpdate({name: postName}, {$inc: {Lnumber: -1}}, {new: true}, function(err, updatedPost) {

			res.json({success: true, msg: 'Post Lnumber incremented', updatedPost: updatedPost});
		});
	}
	else if (!approveOrReject) {

			Post.findOneAndUpdate({name: postName}, {$inc: {Lnumber: 1}}, {new: true}, function(err, updatedPost) {

			res.json({success: true, msg: 'Post Lnumber incremented', updatedPost: updatedPost});
		});
	}


});

router.delete('/remove/:id', isUserAdmin, function(req, res) {
	
	var id = req.params.id;
	Post.getPostById(id, function(err, post) {

		const postName = post.name;
		if (err) throw err;
		if (!post) {

			return res.json({success: false, msg: 'Post not found'});
		}
		else{
			const nameOfFile = post.quest;

			fs.unlink('./public/uploads/' + nameOfFile, function(err) {
		 	
		 	if (err) throw err;
			});

			Post.getPostById(id, function(err, removedPost) {
		
			if (err) throw err;

			for (var i = 0; i < removedPost.subs.length; i++) {

				User.getUserByUsername(removedPost.subs[i].username, function(err, user) {

					for (var j = 0; j < user.subsmade.length; j++) {

						if (user.subsmade[j].postName == postName) {

							user.subsmade.splice(j, 1);
							user.save(function(err, updatedUser) {

								if (err) throw err;
							});
						}
					}
				});
			}
			
			post.remove();
			res.json({success: true, msg: 'Post was removed', removedPost: removedPost});
		});

		}
	});
});

function isUserAdmin(req, res, next) {

	User.getUserById(req.session.user_id, function(err, user) {

		if (err) throw err;
		if (!user) {

			return res.json({success: false, msg: 'you are not logged in'});
		}

		else{
			
			User.adminCheck(user, function(isAdmin){

				if (isAdmin) {

					next();
				}
				else {

				return	res.json({success: false, msg:' user is not the admin'});
				}
			});
		};
	});
};

function isUserUser(req, res, next) {

	User.getUserById(req.session.user_id, function(err, user) {

		if (err) throw err;
		if (!user) {

			return res.json({success: false, msg: 'you are not logged in'});
		}

		else{
			
			User.adminCheck(user, function(isAdmin){

				if (!isAdmin) {

					next();
				}
				else {

				return	res.json({success: false, msg:' user is the admin'});
				}
			});
		};
	});
};

router.put('/update/:id', isUserAdmin, function(req, res) {

	var id = req.params.id;
	Post.findOneAndUpdate({_id: ObjectId(id)}, {$set:
		{name: req.body.name, quest: req.body.quest, Lnumber: req.body.Lnumber}}, function(err, post){

			if (err) throw err;
			res.json({success: true, msg: 'Post updated successfully', post: post})
		});

});

router.get('/remove/:nameOfFile', isUserAdmin, function(req, res) {

	var nameOfFile = req.params.nameOfFile;
	fs.unlink('./public/uploads/'+nameOfFile, function(err) {

		if (err) throw err;
		res.json({success: true, msg: 'PDF removed now update post'});
	});
});

router.get('/getPostforEdit/:id', function(req, res) {

	var id = req.params.id;

	Post.getPostById(id, function(err, post) {

		if (err) throw err;

		res.json(post);
	});
});

router.put('/applyForPost/:postId/:nameOfFile', isUserUser, function(req, res) {

	const postId = req.params.postId;
	const userId = req.session.user_id;
	const nameOfFile = req.params.nameOfFile;
	User.getUserById(userId, function(err, user){

		Post.findOneAndUpdate({_id: ObjectId(postId)}, 
			{$push: 
				{subs: 
					{name: user.name, username: user.username, PDFloc: nameOfFile}
				}
			}, function(err, post) {

				if (err) throw err;
				res.json({success: true, msg: 'Post updated with user submission', post: post});
			});
	});
});

router.get('/getpostList', function(req, res) {

	Post.find(function(err, doc) {

		res.json(doc);
	});
});

module.exports = router;