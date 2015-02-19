/**
 * EmailController
 *
 * @description :: Server-side logic for managing emails
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {
		res.view();
	},

	create: function (req, res, next) {
		Email.create(req.params.all(), function emailCreated(err, email){
			if (err) {
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}

				return res.redirect('/email/new');
			}

			var EmailCreationSuccess = [{name: 'EmailCreation', message: 'Email successfully created!'}]
			req.session.flash={
				err: EmailCreationSuccess
			}
			res.redirect('/email/index/');
		});
	},

	index: function(req, res, next){
		Email.find(function foundEmails (err, emails){
			if (err) return next(err);
			
			res.view({
				emails: emails,	
			});
		})
	},

	show: function (req, res, next){
		Email.findOne(req.param('id'), function foundEmail(err, email){
			if (err) return next(err);
			if (!email) return next();
			res.view({
				email: email,
			});
		});
	},

	edit: function (req, res, next){
		Email.findOne(req.param('id'), function foundEmail(err, email){
			if (err) return next(err);
			if (!email) return next();
			res.view({
				email: email,
			});
		});
	},

	update: function(req, res, next){
		Email.update(req.param('id'), req.params.all() , function emailUpdated (err){
			if (err){
				req.session.flash={
					err: err.ValidationError
				}
				return res.redirect('/email/edit/' + req.param('id'));
			}else{
				res.redirect('/email/edit/' + req.param('id'));
			}
		});
	},

	destroy: function (req, res, next){
		Email.findOne(req.param('id'), function foundEmail (err, email){
			if (err) return next(err);

			if (!email) return next('Email doesn\'t exists.');

			Email.destroy(req.param('id'), function emailDestroyed(err){
				if (err) return next (err);
			});

			res.redirect('/email/index');
		});
	},
};

