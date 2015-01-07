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

			var ticketObj = {

        		firstName: values.firstName,
        		lastName: values.lastName,
        		email: values.email,
        		ticketNumber: values.ticket
      		}

      		Ticket.create(ticketObj, function addTicketToList(err, ticket) {
      			if (err) {
      				console.log(err);
      				req.session.flash={
      					err: err.validationError
      				}

      				return res.redirect('/user/new');
      			}

				//res.json(user);

				res.redirect('/user/show/'+user.id);
      		});
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

	edit: function (req, res, next){
		//TODO
		User.findOne(req.param('id'), function foundUser (err,user){
			if (err) return next(err);
			if (!user) return next();

			res.view({
				user: user
			});
		});
	},

	update: function(req, res, next){
		User.update(req.param('id'), req.params.all(), function userUpdated (err){
			if (err){
				return res.redirect('/user/edit/' + req.param('id'));
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
	}
};

