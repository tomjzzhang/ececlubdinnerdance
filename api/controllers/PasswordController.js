/**
 * PasswordController
 *
 * @description :: Server-side logic for managing passwords
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'index': function(req, res) {
		res.view();
	},

	'change': function(req, res, next) {

		var bcrypt = require('bcryptjs');

		if(typeof req.param('old_password') == 'undefined'){
			var passwordRequiredError = [{name: 'passwordRequired', message: 'Current Password Required'}]
			req.session.flash = {
				err: passwordRequiredError
			}
			res.redirect('/password/index');
			return;
		}

		User.findOne(req.session.User.id, function foundUser(err, user){
			if (err) return next(err);

			if (!user) return next('User doesn\'t exists.');

			bcrypt.compare(req.param('old_password'), user.encryptedPassword, function (err, valid){
				if (err) return next(err);

				if (!valid){
					var incorrectPasswordError = [{name: 'incorrectPassword', message: 'Invalid password'}]
					req.session.flash = {
						err: incorrectPasswordError
					}
					res.redirect('/password/index');
					return;
				}

				if(!req.param('new_password') || req.param('new_password') != req.param('confirmation')) {
     				var passwordMismatchError = [{name: 'passwordMismatch', message: 'Password does not match confirmation'}]
					req.session.flash = {
						err: passwordMismatchError
					}
					res.redirect('/password/index');
					return;
    			}

				bcrypt.genSalt(10, function(err, salt) {
				    bcrypt.hash(req.param('new_password'), salt, function(err, hash) {
				        // Store hash in your password DB.
				        if (err) return next(err);
				        
				        var passwordObj = {encryptedPassword: hash}; 
				        User.update(req.session.User.id, passwordObj, function passUpdated (err){
							if (err){
								return next(err);
							}

							var passwordUpdated = [{name: 'passwordUpdated', message: 'Password successfully updated!'}]
							req.session.flash = {
								err: passwordUpdated
							}
							res.redirect('/password/index');
						});
				    });
				});
			});
		})
	},
	
	'reset' : function(req, res, next){
		res.view();
	},

	'generateLink' : function(req, res, next){
		if (!req.param('ticketNumber')){
			var ticketNumberRequiredError = [{name: 'ticketNumberRequired', message: 'Ticket Number is required'}]
			req.session.flash = {
				err: ticketNumberRequiredError
			}

			res.redirect('/password/reset');
			return;
		}
		
		if(isNaN(parseInt(req.param('ticketNumber'))) || parseInt(req.param('ticketNumber')) <= 0){
			var invalidTicketNumberError = [{name: 'invalidTicketNumber', message: 'Invalid Ticket Number'}]
			req.session.flash = {
				err: invalidTicketNumberError
			}

			res.redirect('/password/reset');
			return;
		}

		User.findOneByTicketNumber(req.param('ticketNumber')).exec(function(err, user){
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{name: 'noAccount', message: 'The ticket number ' + req.param('ticketNumber') + ' was not found'}]
				req.session.flash = {
					err: noAccountError
				}

				res.redirect('/password/reset');
				return;
			}

			var randtoken = require('rand-token');
			// Generate a 16 character alpha-numeric token:
			var resetToken = randtoken.generate(20);

			var criteria = {passwordResetLink: resetToken + user.id};
			User.update(user.id, criteria, function userUpdated (err){
				if (err){
					console.log(err);
					req.session.flash={
						err: err.ValidationError
					}
					res.redirect('/password/reset');
					return;
				}

				//TODO should make link expire
				var link = 'http://' + req.get('host') + '/password/sendEmail?passwordResetLink=' + resetToken + user.id;

				var text = 	'Hi ' +  user.name + ' \n'+
							'Someone has requested to reset your password. If this is you, please follow the link: \n'+
							link + '\n' +
							'If this is not you, please feel free to ignore this email \n';

				var html = 	'<p>Hi ' +  user.name + ' </p>'+
							'<p>Someone has requested to reset your password. If this is you, please follow the link:</p>'+
							'<a href="'+ link + '" target="_blank"">' + link + '</a>' +
							'<p>If this is not you, please feel free to ignore this email</p>';

				var emailOptions = {
					email: user.email,
					subject: 'ECE Dinnerdance - Password Reset Request',
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
						var passwordResetRequestSuccess = [{name: 'passwordResetRequest', message: 'Request for password reset has been successfully sent! Check your email for further instructions.'}]
						req.session.flash={
							err: passwordResetRequestSuccess
						}
					}
					return res.redirect('/password/reset');
				});

			});
		});
	},

	'sendEmail' : function(req, res, next){
		User.findOneByPasswordResetLink(req.param('passwordResetLink')).exec(function(err, user){
			if (err) return next(err);

			if (!user) {
				var invalidResetLinkError = [{name: 'invalidResetLinkError', message: 'The reset link sent is no longer valid'}]
				req.session.flash = {
					err: invalidResetLinkError
				}

				res.redirect('/password/reset');
				return;
			}

			var randtoken = require('rand-token');
			// Generate a 16 character alpha-numeric token:
			var newPass = randtoken.generate(10);

			var bcrypt = require('bcryptjs');
			bcrypt.genSalt(10, function(err, salt) {
			    bcrypt.hash(newPass, salt, function(err, hash) {
			        // Store hash in your password DB.
			        if (err) return next(err);
			        
			        var userObj = {
			        	encryptedPassword: hash,
			        	passwordResetLink: undefined
			        }; 

			        User.update(user.id, userObj, function passUpdated (err){
						if (err){
							return next(err);
						}


						var signinLink = req.get('host') + '/session/new';
						// NB! No need to recreate the transporter object. You can use
						// the same transporter object for all e-mails
						var text = 	'Hi ' +  user.name + ' \n'+
									'Your password has been reset with the following credentials: \n' +
									'Ticket Number:  ' + user.ticketNumber + '\n Password: ' + newPass + '\n \n' +
									'Please sign in with these credentials at ' + signinLink + 'and change your password as soon as possible.';

						var html = 	'<p>Hi ' +  user.name + ' </p>'+
									'<p>Your password has been reset with the following credentials: </p>' +
									'<div><strong>Ticket Number: </strong>' + user.ticketNumber + '<br>' +
									'<strong>Password: </strong>' + newPass + '</div>' +
									'<p>Please sign in with these credentials at <a href="'+ signinLink + '" target="_blank">' + signinLink + '</a> and change your password as soon as possible. </p>';

						// setup e-mail data with unicode symbols
						var emailOptions = {
							email: user.email,
							subject: 'ECE Dinnerdance - Password Reset',
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
								var passwordResetRequestSuccess = [{name: 'passwordResetRequest', message: 'Request for password reset has been successfully sent! Check your email for further instructions.'}]
								req.session.flash={
									err: passwordResetRequestSuccess
								}
							}
							return res.redirect('/password/reset');
						});
					});
			    });
			});
		});

		
	},
};

