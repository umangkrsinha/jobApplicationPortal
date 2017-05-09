const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const users = require('./routes/users');
const files = require('./routes/files');
const posts = require('./routes/posts');
const config = require('./config/database');
const session = require('express-session');
const app = express();
const User = require('./models/user');

//Connecting database
mongoose.connect(config.database);

mongoose.connection.on("connected", function() {

	console.log('Connected to database '+config.database);
});

mongoose.connection.on("error", function(err) {

	console.log('Database error:'+error);
});
//Port number
const port = 3000;

//Setting up Sessions
app.use(session({secret: 'SessionSecret'}));

//setting views
app.set('views', path.join(__dirname, '/views'));

//setting view engine
app.set('view engine', 'pug');

//CORS Middleware
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Index Route
app.get('/', function(req, res){

	res.send("Invalid Endpoint");
});

app.get('/hmPage', isUserAdmin, function(req, res){

	res.render('hmPage.pug');
});

app.get('/applicantPage', isUserUser, function(req, res){

	res.render('applicantPage.pug');
});

app.get('/postInfo/:postId', function(req, res){

	const postId = req.params.postId;
	res.render('postInfo.pug', {postId: postId});
});

app.get('/historyPage', isUserUser, function(req, res){

	res.render('historyPage.pug');
});

app.get('/checkLogin', function(req, res){

	if (!req.session.user_id) {

		res.json({success: false});
	} else {

		res.json({success: true});
	};
});

app.get('/logout', function(req, res){

	delete req.session.user_id;
	res.json({success: true, msg: 'Logged out'});
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

//Users Route
app.use('/users', users);

//files route
app.use('/files', files);

//posts route
app.use('/posts', posts);

//Start Server
app.listen(port, function() {

	console.log("server started on port "+port);
});
