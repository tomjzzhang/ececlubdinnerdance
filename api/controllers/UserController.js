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
	}

};

