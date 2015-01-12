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

	'sendEmail' : function(req, res, next){
		if (!req.param('ticketNumber')){
			var ticketNumberRequiredError = [{name: 'ticketNumberRequired', message: 'Ticket Number is required'}]
			req.session.flash = {
				err: ticketNumberRequiredError
			}

			res.redirect('/password/reset');
			return;
		}

		if (!process.env.MAILUSER || process.env.MAILPASS){
			var serviceUnavailableError = [{name: 'serviceUnavailable', message: 'Service is currently unavailable.'}]
			req.session.flash = {
				err: serviceUnavailableError
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
			var newPass = randtoken.generate(10);

			var bcrypt = require('bcryptjs');
			bcrypt.genSalt(10, function(err, salt) {
			    bcrypt.hash(newPass, salt, function(err, hash) {
			        // Store hash in your password DB.
			        if (err) return next(err);
			        
			        var passwordObj = {encryptedPassword: hash}; 
			        User.update(user.id, passwordObj, function passUpdated (err){
						if (err){
							return next(err);
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

						var signinLink = 'localhost:1337'+ '/session/new';
						// NB! No need to recreate the transporter object. You can use
						// the same transporter object for all e-mails
						var text = 'Your password has been reset with the following credentials: \n Ticket Number:  ' + user.ticketNumber + '\n Password: ' + newPass + '\n \n Please sign in with these credentials at ' + signinLink + 'and change your password as soon as possible.';

						var html = '<p>Your password has been reset with the following credentials: </p><div><strong>Ticket Number: </strong>' + user.ticketNumber + '<br><strong>Password: </strong>' + newPass + '</div><p>Please sign in with these credentials at <a href="'+ signinLink + '">' + signinLink + '</a> and change your password as soon as possible. </p>';

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
						    	var passwordReset = [{name: 'passwordReset', message: 'Password successfully reset! Please check your email for further instructions.'}]
								req.session.flash = {
									err: passwordReset
								}
						        console.log('Message sent: ' + info.response);
						    }
						});

						
						res.redirect('/password/reset');
					});
			    });
			});
		});

		
	},
};

