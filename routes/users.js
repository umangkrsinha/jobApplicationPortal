const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const ObjectId = require('mongodb').ObjectID;

//Register User
router.post('/register/user', function(req, res) {

	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		role: 'user'
	});

	User.addUser(newUser, function(err, user) {

		if(err){
			res.json({success: false, msg: 'Failed to add user'});
		}
		else {
			res.json({success: true, msg: "User added"});
		}
	});
});

router.get('/getUserApprovalStatusHM/:userName/:postName', loginCheck, function(req, res) {

	const userName = req.params.userName;
	const nameOfPost = req.params.postName;
	User.getUserByUsername(userName, function(err, user) {

		if (err) throw err;
		for (var key= 0; key < user.subsmade.length; key++) {
			if ((user.subsmade[key]).postName == nameOfPost) {
				
				console.log(user.subsmade[key].postName);
				console.log(nameOfPost);
				console.log(user.subsmade[key].approvalStatus);
				status = user.subsmade[key].approvalStatus;
			}
		}
		res.json({success: true, msg: "User was found", status: status});
	});
});

router.put('/approveOrReject/:username/:postName', isUserAdmin, function(req, res) {

	const username = req.params.username;
	const postName = req.params.postName;
	approveOrReject = req.body.approveOrReject;
	if (approveOrReject) {

		User.findOneAndUpdate({username: username, 'subsmade.postName': postName}, {'$set': 
			{'subsmade.$.approvalStatus': 'approved'}}, {new: true}, function(err, updatedUser) {

			if (err) throw err;
			res.json({success: true, msg: 'User updated (approved)', updatedUser: updatedUser});
		});
	}
	else if (!(approveOrReject)) {

		User.findOneAndUpdate({username: username, 'subsmade.postName': postName}, {'$set': 
			{'subsmade.$.approvalStatus': 'rejected'}}, {new: true}, function(err, updatedUser) {

			if (err) throw err;
			res.json({success: true, msg: 'User updated (rejected)', updatedUser: updatedUser});
		});
	} 
});

//Authenticate
router.post('/authenticate', function(req, res) {

	
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, function(err, user) {

		if (err) throw err;
		if (!user) {

			return res.json({success: false, msg: "User not found"});
		};

		User.comparePassword(password, user.password, function(err, isMatch) {
			
			if (err) throw err;
			if (isMatch){

				req.session.user_id = user._id;

				const token = jwt.sign(user, config.secret, {

					expiresIn: 604800 //for 1 week
				});
				
				res.json({
					success: true, 
					msg: 'User Logged in!',
					token: 'JWT '+token, 
					user:{

						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			}
			else {

				return res.json({success: false, msg: "Wrong password"});
			};
		});
	});
});

//Register Admin
router.post('/registerAdmin', adminPresence, function(req, res) {

	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		role: 'admin'
	});

	User.addUser(newUser, function(err, user) {

		if(err){
			res.json({success: false, msg: 'Failed to add admin'});
		}
		else {
			res.json({success: true, msg: "Admin made"});
		}
	});
});
	//check for login before this
router.get('/adminCheck', loginCheck, function(req, res) {

	User.getUserById(req.session.user_id, function(err, user) {

		if (err) throw err;
		if (!user) {

			return res.json({success: false, msg: 'you are not logged in'});
		}

		else{
			
			User.adminCheck(user, function(isAdmin){

				if (isAdmin) {

					res.json({success: true, msg: 'user is the admin'});
				}
				else {

					res.json({success: false, msg:' user is not the admin'});
				}
			});
		};
	});
});

router.get('/getUser', loginCheck, function(req, res) {

	User.getUserById(req.session.user_id, function(err, user) {

		res.json({success: true, msg: 'Sending user', user: user});
	});
});

router.get('/adminPresence', function(req, res) {

	User.getUserByRole('admin', function(err, user) {

		if (err) throw err;
		if (!user) {

			res.json({success: false, msg: 'admin is not present'});
		}
		else {

			res.json({success: true, msg: 'admin is present'});
		}
	});
});

//Admin Presence in database check Middleware
function adminPresence(req, res, next){

	User.getUserByRole('admin', function(err, user){

		if (err) throw err;
		if(!user) {

			next();
		}
		else {

			return res.json({success: false, msg: 'admin is already made'});
		}
	});
};

function loginCheck(req, res, next) {

	if (!req.session.user_id) {

		return res.json({success: false, msg: 'user not logged in'});
	} else {

		next();
	};
}

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

router.post('/registerUser', function(req, res) {

	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
		role: 'user'
	});

	User.addUser(newUser, function(err, user) {

		if(err){
			res.json({success: false, msg: 'Failed to add user'});
		}
		else {
			res.json({success: true, msg: "User registered"});
		}
	});
});

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

router.put('/applyForPost/:nameOfFile/:postName', isUserUser, function(req, res) {

	const userId = req.session.user_id;
	const nameOfFile = req.params.nameOfFile;
	const postName = req.params.postName;
	User.findOneAndUpdate({_id: ObjectId(userId)}, 
		{$push: 
			{subsmade: 
				{postName: postName, approvalStatus: "null", submittedPDF: nameOfFile}
			}
		}, function(err, user) {

			if (err) throw err;
			res.json({success: true, msg: "submission added to user info", userId: userId});
		});
});

module.exports = router;
