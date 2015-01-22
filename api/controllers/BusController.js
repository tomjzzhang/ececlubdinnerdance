/**
 * BusController
 *
 * @description :: Server-side logic for managing buses
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {
		res.view();
	},

	create: function (req, res, next) {
		Bus.create(req.params.all(), function busCreated(err, bus){
			if (err) {
				console.log(err);
				req.session.flash={
					err: err.ValidationError
				}

				return res.redirect('/bus/new');
			}

			var BusCreationSuccess = [{name: 'BusCreation', message: 'bus successfully created!'}]
			req.session.flash={
				err: BusCreationSuccess
			}
			res.redirect('/bus/index/');
		});
	},

	index: function(req, res, next){
		
		Bus.find({ where: { type: 'leaving' }, sort: 'date ASC' }, function foundBuses (err, leavingBuses){
			if (err) return next(err);
			
			Bus.find({ where: { type: 'returning' }, sort: 'date ASC' }, function foundBuses (err, returningBuses){
				if (err) return next(err);

				res.view({
					leavingBuses: leavingBuses,
					returningBuses: returningBuses,
				})
			});
		})
	},

	refresh: function(req, res, next){
		
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
						console.log(remainingSeats);
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
					busDepartTime: bus.id
				}
				User.find(criteria, function (err, users){
					if (err){
						console.log(err);	
					}else{
						var numSeats = users.length;
						var remainingSeats = maxSeats - numSeats;
						console.log(remainingSeats);
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

		res.redirect('/bus/index/');
	},

	destroy: function (req, res, next){
		Bus.findOne(req.param('id'), function foundBus (err, bus){
			if (err) return next(err);

			if (!Bus) return next('Bus doesn\'t exists.');

			Bus.destroy(req.param('id'), function busDestroyed(err){
				if (err) return next (err);
			});

			res.redirect('/bus/index');
		});
	},
};

