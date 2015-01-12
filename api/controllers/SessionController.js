/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var bcrypt = require('bcryptjs');

module.exports = {

	'new' : function(req, res) {
		res.view('session/new');
	},

	'create' : function(req, res, next){

		if (!req.param('ticketNumber') || !req.param('password')){
			var ticketNumberPasswordRequiredError = [{name: 'ticketNumberPasswordRequired', message: 'You must enter both a username and password.'}]
			req.session.flash = {
				err: ticketNumberPasswordRequiredError
			}

			res.redirect('/session/new');
			return;
		}

		User.findOneByTicketNumber(req.param('ticketNumber')).exec(function(err, user){
			if (err) return next(err);

			if (!user) {
				var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found'}]
				req.session.flash = {
					err: noAccountError
				}

				res.redirect('/session/new');
				return;
			}

			bcrypt.compare(req.param('password'), user.encryptedPassword, function (err, valid){
				if (err) return next(err);

				if (!valid){
					var accountPasswordMismatchError = [{name: 'accountPasswordMismatch', message: 'Invalid username and password combination'}]
					req.session.flash = {
						err: accountPasswordMismatchError
					}
					res.redirect('/session/new');
					return;
				}

				req.session.authenticated = true;
				delete user.encryptedPassword;
				req.session.User = user;

				res.redirect('/user/show/' + user.id);
			});
		});
	},

	destroy: function(req, res, next){
		req.session.destroy();
		res.redirect('/session/new');
	}
};
