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
		delete userObj.tableNum;
		delete passwordResetLink;

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
				user: user,
				layout: 'mainlayout'
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
		delete userObj.tableNum;
		delete passwordResetLink;

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
		res.view({
			layout: 'mainlayout'
		});
	},

	registerUser: function(req, res, next){
		var randtoken = require('rand-token');
		// Generate a 16 character alpha-numeric token:
		var newPass = randtoken.generate(10);

		var userObj = req.params.all();
		delete userObj.admin;
		delete userObj.tableNum;
		delete passwordResetLink;
		userObj.password = newPass;
		userObj.confirmation = newPass;

		User.create(userObj, function userCreated(err, user){
			if (err) {
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}

				return res.redirect('/user/register');
			}

			var signinLink = 'http://' + req.get('host') + '/session/new';
			// NB! No need to recreate the transporter object. You can use
			// the same transporter object for all e-mails
			var text = 	'Hi' + user.name + '\n'
						'Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: \n' +
						'Ticket Number:  ' + user.ticketNumber + '\n Password: ' + newPass + '\n \n' +
						'Please sign in with these credentials at ' + signinLink + 'and change your password as soon as possible.';

			var html = '<p>Hi ' +  user.name + ' </p>'+
						'<p>Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: </p>'+
						'<div><strong>Ticket Number: </strong>' + user.ticketNumber + '<br><strong>Password: </strong>' + newPass + '</div>' +
						'<p>Please sign in with these credentials at <a href="'+ signinLink + '" target="_blank">' + signinLink + '</a> '+
						'and change your password as soon as possible.</p>';

			var emailOptions = {
				email: user.email,
				subject: 'Welcome to ECE Dinnerdance',
				html: html,
				text: text
			}

			EmailService.sendOneEmail(emailOptions, function emailSent(err){
				if(err){
					console.log(err);
					req.session.flash={
						err: err
					}
				}else{
					var accountCreationSuccess = [{name: 'accountCreation', message: 'Account successfully created! Check your email for further instructions.'}]
					req.session.flash={
						err: accountCreationSuccess
					}
				}
				return res.redirect('/user/register');
			});


		});
	},
};
