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
	}
};

