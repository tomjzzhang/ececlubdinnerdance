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

			return res.redirect('/user/new');
		});
	},

	show: function (req, res, next){
		User.findOne(req.param('id'), function foundUser(err, user){
			if (err) return next(err);
			if (!user) return next();
			Bus.find({ where: { type: 'leaving' }, sort: 'date ASC' }, function foundBuses (err, leavingBuses){
				if (err) return next(err);
				
				Bus.find({ where: { type: 'returning' }, sort: 'date ASC' }, function foundBuses (err, returningBuses){
					if (err) return next(err);

					if (user.activated == true){
						res.view({
							user: user,
							leavingBuses: leavingBuses,
							returningBuses: returningBuses,
							layout: 'mainlayout'
						});
					}else{
						var userObj = {
							activated: true
						}
						User.update(req.param('id'), userObj, function userUpdated (err){
							if (err){
								req.session.flash={
									err: err.ValidationError
								}
								res.view({
									user: user,
									leavingBuses: leavingBuses,
									returningBuses: returningBuses,
									layout: 'mainlayout'
								});
							}else{
								res.redirect('/password/index/');
							}
						});
					}
					
				});
			});
		});
	},

	index: function(req, res, next){
		var criteria = {sort: 'ticketNumber ASC'};
		var activated = req.param('activated');

		var whereObj = {};
		if (typeof activated != 'undefined'&& activated != undefined && activated != ''){
			whereObj.activated = activated;
			criteria.where = whereObj;
		}

		User.find(criteria, function foundUsers (err, users){
			if (err) return next(err);
			
			res.view({
				users: users,	
				length: users.length
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

		var maxSeats = 48;

		Bus.find({ type: 'leaving' }, function foundBuses (err, leavingBuses){
			if (err) return next(err);
			
			leavingBuses.map(function(bus) {
				var criteria = {
					busDepartTime: bus.id
				}
				User.find(criteria, function (err, users){
					if (err){
						console.log(err);	
					}else{
						var numSeats = users.length;
						var remainingSeats = maxSeats - numSeats;
						var busObj = {
							seats: remainingSeats
						}
						Bus.update(bus.id, busObj, function(err){
							if (err) console.log();
						})
					} 
				});
			});
		});

		Bus.find({ type: 'returning' }, function foundBuses (err, returningBuses){
			if (err) return next(err);

			returningBuses.map(function(bus) {
				var criteria = {
					busReturnTime: bus.id
				}
				User.find(criteria, function (err, users){
					if (err){
						console.log(err);	
					}else{
						var numSeats = users.length;
						var remainingSeats = maxSeats - numSeats;
						var busObj = {
							seats: remainingSeats
						}
						Bus.update(bus.id, busObj, function(err){
							if (err) console.log();
						})
					} 
				});
			});
		});

		User.update(req.param('id'), userObj, function userUpdated (err){
			if (err){
				req.session.flash={
					err: err.ValidationError
				}
				return res.redirect('/user/show/' + req.param('id'));
			}else{
				res.redirect('/user/show/' + req.param('id'));
			}
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
			var text = 	'Hi ' + user.name + '\n' +
						'Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: \n' +
						'Ticket Number:  ' + user.ticketNumber + '\n Password: ' + newPass + '\n \n' +
						'Please sign in with these credentials at ' + signinLink + 'and change your password as soon as possible. '+
						'If you have signed up on someone\'s behalf, please forward them this information.';

			var html = '<p>Hi ' +  user.name + ' </p>'+
						'<p>Thank you for registering for ECE dinnerdance! Your account has been created with the following credentials: </p>'+
						'<div><strong>Ticket Number: </strong>' + user.ticketNumber + '<br><strong>Password: </strong>' + newPass + '</div>' +
						'<p>Please sign in with these credentials at <a href="'+ signinLink + '" target="_blank">' + signinLink + '</a> '+
						'and change your password as soon as possible. If you have signed up on someone\'s behalf, please forward them this information.</p>';

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

	sendReminder: function(req, res, next){

		User.find({activated: false}, function foundUsers (err, users){
			if (err) return next(err);
			
			EmailService.sendReminder(req, users, function emailSent(err){
				if(err){
					console.log(err);
					req.session.flash={
						err: err
					}
				}else{
					var reminderSentSuccess = [{name: 'reminderSent', message: 'Reminder successfully sent!'}]
					req.session.flash={
						err: reminderSentSuccess
					}
				}
				return res.redirect('/user/index');
			});
		})
	},

	sendUpdates: function(req, res, next){
		var subject = 'ECE Dinner dance Updates';

		var html = '<p>Hey everyone!</p>'+
                    '<p>Here are the final very important updates for the ECE Dinner Dance: </p>'+
                    '<ol>'+
                    '<li><p>The bus schedule has been modified with the following adjustments based on current preferences:</p>'+
                    '<ul>' +
                    '<li>The 12:30 a.m. bus has been moved to 1:15 a.m., as an additional bus at that time</li>'+
                    '<li>o	The 12:45 a.m. bus has been moved to 1:30 a.m., as an additional bus at that time</li>'+
                    '</ul>' +
                    '<p>If you selected one of those bus times listed above then please note that your new bus time is whichever ' +
                    'bus that is corresponding as shown above. If you don’t like your new time then please feel free to change your ' +
                    'new bus to any of the other buses.</p>'+
                    '</li>'+
                    '<li>The first two buses scheduled at 11:30 p.m. and 12:00 a.m. buses are primarily for commuters. If you do need to commute upon your arrival at SF, then please take one of these two buses.</li>'+
                    '<li>The buses after and including 1:00 a.m. will not leave until they are full; this is to ensure that everyone gets a ride home.</li>'+
                    '<li>Those of you that have selected either vegetarian or halal options, you will both be given unique meals (so there is a difference between the two).</li>'+
                    '<li>Waffles will be provided with a selection of French Vanilla Ice Cream Syrup, Maple Syrup, Decadent Chocolate Sauce, and Strawberry Coulis as toppings.</li>'+
                    '<li>Please also complete your registration no later than <strong>Wednesday, February 11th</strong>.</li>'+
                    '</ol>' +
                    '<p>If you have any additional questions or concerns, please email ECE club at ececlub@ecf.utoronto.ca as soon as possible.</p>'+
                    '<p>Hope you’re all ready for one epic dinner dance!</p>'+
                    '<p>Love,</p>'+
                    '<p>ECE Club</p>';

		EmailService.sendToAll(subject, html, function emailSent(err){
			if(err){
				console.log(err);
				req.session.flash={
					err: err
				}
			}else{
				var reminderSentSuccess = [{name: 'reminderSent', message: 'Reminder successfully sent!'}]
				req.session.flash={
					err: reminderSentSuccess
				}
			}
			return res.redirect('/user/index');
		});
	}
};
