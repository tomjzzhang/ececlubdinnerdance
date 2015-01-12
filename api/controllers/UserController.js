/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {
		res.view({
      		layout: 'mainlayout'
		});
	},

	create: function (req, res, next) {
		var userObj = req.params.all();
		delete userObj.admin;

		User.create(userObj, function userCreated(err, user){
			if (err) {
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}

				return res.redirect('/user/new');
			}

			req.session.authenticated = true;

			delete user.encryptedPassword;
			req.session.User = user;
			
			res.redirect('/user/show/'+user.id);
		});
	},

	show: function (req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) return next();
			res.view({
				user: user
			});
		});
	},

	index: function(req, res, next){
		User.find(function foundUsers (err, users){
			if (err) return next(err);
			//pass the array down to the /views/index.ejs page
			res.view({
				users: users
			})
		})
	},

	update: function(req, res, next){
		var userObj = req.params.all();
		delete userObj.admin;
		delete userObj.ticketNumber;

		if (userObj.dietaryRestrictions =='Other' && userObj.otherDietaryRestrictions){
			userObj.dietaryRestrictions = userObj.otherDietaryRestrictions;
			delete userObj.otherDietaryRestrictions;
		}

		User.update(req.param('id'), userObj, function userUpdated (err){
			if (err){
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}
				return res.redirect('/user/show/' + req.param('id'));
			}

			res.redirect('/user/show/' + req.param('id'));
		});
	},

	destroy: function (req, res, next){
		User.findOne(req.param('id'), function foundUser (err, user){
			if (err) return next(err);

			if (!user) return next('User doesn\'t exists.');

			User.destroy(req.param('id'), function userDestroyed(err){
				if (err) return next (err);
			});

			res.redirect('/user');
		})
	},

	newAdmin: function(req, res, next){
		res.view();
	},

	createAdmin: function(req,res, next){
		var criteria = {admin : true};
		User.count(criteria, function numAdmins (err, num){
			if (err) return next(err);

			console.log('Num admins: ' + num);

			if (num > 0){
				var multipleAdminsError = [{name: 'multipleAdmins', message: 'Stop trying to create another admin user!'}]
				req.session.flash = {
					err: multipleAdminsError
				}
				res.redirect('/user/newAdmin');
				return;
			}else{
				var adminObj = {
					ticketNumber: 0,
					name: 'Admin',
					email: 'ececlub@ecf.utoronto.ca',
					password: req.param('password'),
					confirmation: req.param('confirmation'),
					admin: true,
				}

				User.create(adminObj, function adminCreated(err, user){
					if (err) {
						console.log(err);
						req.session.flash={
							err: err.ValidationError
						}

						return res.redirect('/user/newAdmin');
					}

					req.session.authenticated = true;

					delete user.encryptedPassword;
					req.session.User = user;
					
					res.redirect('/user/show/'+user.id);
				});
			}
		});
	},

	register: function(req, res, next){
		res.view();
	},

	registerUser: function(req, res, next){
		if (!process.env.MAILUSER || process.env.MAILPASS){
			var serviceUnavailableError = [{name: 'serviceUnavailable', message: 'Service is currently unavailable.'}]
			req.session.flash = {
				err: serviceUnavailableError
			}
			return res.redirect('/user/register');
		}

		var randtoken = require('rand-token');
		// Generate a 16 character alpha-numeric token:
		var newPass = randtoken.generate(10);

		var userObj = {
			ticketNumber: req.param('ticketNumber'),
			ticketType: req.param('ticketType'),
			name: req.param('name'),
			password: newPass,
			confirmation: newPass
		}

		User.create(userObj, function userCreated(err, user){
			if (err) {
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}

				return res.redirect('/user/register');
			}
			
			var nodemailer = require('nodemailer');

			// create reusable transporter object using SMTP transport
			var transporter = nodemailer.createTransport({
			    service: 'Gmail',
			    auth: {
			        user: process.env.MAILUSER,
			        pass: process.env.MAILPASS
			    },
			});

			var signinLink = req.get('host') + '/session/new';
			// NB! No need to recreate the transporter object. You can use
			// the same transporter object for all e-mails
			var text = 'Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: \n Ticket Number:  ' + user.ticketNumber + '\n Password: ' + newPass + '\n \n Please sign in with these credentials at ' + signinLink + 'and change your password as soon as possible.';

			var html = '<p>Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: </p><div><strong>Ticket Number: </strong>' + user.ticketNumber + '<br><strong>Password: </strong>' + newPass + '</div><p>Please sign in with these credentials at <a href="'+ signinLink + '">' + signinLink + '</a> and change your password as soon as possible. </p>';

			// setup e-mail data with unicode symbols
			var mailOptions = {
			    from: 'ECE Club <dinnerdance@ece.skule.ca>', // sender address
			    to: user.email, // list of receivers
			    subject: 'ECE Dinner Dance Password Reset', // Subject line
			    text: text, // plaintext body
			    html: html // html body
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, function(error, info){
			    if(error){
			        console.log(error);
			    }else{
			    	var passwordReset = [{name: 'passwordReset', message: 'Account successfully created! Please check your email for further instructions.'}]
					req.session.flash = {
						err: passwordReset
					}
			        console.log('Message sent: ' + info.response);
			    }
			});


			return res.redirect('/user/register');
		});
	}

};

