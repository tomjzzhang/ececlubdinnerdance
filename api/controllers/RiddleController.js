/**
 * RiddleController
 *
 * @description :: Server-side logic for managing riddles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {
		res.view();
	},

	create: function (req, res, next) {
		/*
		var riddleObj = req.params.all();
		var oldDate = new Date(); 
		var newDate = new Date(oldDate.getTime() + 7*24*60*60*1000);
		console.log(newDate);
		riddleObj.expiryDate = newDate.toISOString();*/
		Riddle.create(req.params.all(), function riddleCreated(err, riddle){
			if (err) {
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}

				return res.redirect('/riddle/new');
			}

			var riddleCreationSuccess = [{name: 'riddleCreation', message: 'Riddle successfully created!'}]
			req.session.flash={
				err: riddleCreationSuccess
			}
			res.redirect('/riddle/new/');
		});
	},

	index: function(req, res, next){
		Riddle.find(function foundRiddles (err, riddles){
			if (err) return next(err);
			
			res.view({
				riddles: riddles
			})
		})
	},

	edit: function (req, res, next){
		Riddle.findOne(req.param('id'), function foundRiddle(err, riddle){
			if (err) return next(err);
			if (!riddle) return next();

			var riddleUpdateSuccess = [{name: 'riddleUpdate', message: 'Riddle successfully updated!'}]
			req.session.flash={
				err: riddleUpdateSuccess
			}
			res.view({
				riddle: riddle,
			});
		});
	},

	update: function(req, res, next){
		Riddle.update(req.param('id'), req.params.all(), function userUpdated (err){
			if (err){
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}
				return res.redirect('/riddle/edit/' + req.param('id'));
			}

			res.redirect('/riddle/edit/' + req.param('id'));
		});
	},

	destroy: function (req, res, next){
		Riddle.findOne(req.param('id'), function foundRiddle (err, riddle){
			if (err) return next(err);

			if (!riddle) return next('Riddle doesn\'t exists.');

			Riddle.destroy(req.param('id'), function riddleDestroyed(err){
				if (err) return next (err);
			});

			res.redirect('/riddle/index');
		})
	},
};

