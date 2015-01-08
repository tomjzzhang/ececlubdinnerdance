/**
 * TicketController
 *
 * @description :: Server-side logic for managing tickets
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
	'new': function(req, res) {
		res.view();
	},

	create: function(req, res, next) {
		Ticekt.create(req.params.all(), function(err, ticket) {
			if (err) {
				console.log(err);
				req.session.flash = {
					err: err.validationError
				}

				return res.redirect('/ticket/new');
			}
		});
	}
};

