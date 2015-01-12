/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {
		res.view();
	},

	create: function (req, res, next) {
		User.create(req.params.all(), function userCreated(err, user){
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
		//TODO marshall parameters

		//TODO double check params are valid, client side validation

		User.update(req.param('id'), req.params.all(), function userUpdated (err){
			if (err){
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
		//TODO create view
		res.view();
	},

	createAdmin: function(req,res, next){
		//TODO
		//count existing admins
		//if zero, create one, otherwise produce error
	}

};

