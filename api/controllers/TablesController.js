/**
 * TablesController
 *
 * @description :: Server-side logic for managing tables
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'index': function(req, res, next) {
			var tableSeating = new Array(10); // Tables

			//TODO
			// Seats
			for (i = 0; i < 10; i++) {
				var userObj = { tableName: i};
				User.find(userObj, function foundUser (err,users){
					if (err) return next(err);
					if (!users) return next();
					console.log(users);
					tableSeating[i] = users;
				});

			}

			res.view({
				tableSeating: tableSeating
			});


			res.view();
		},

	'addUser': function(req, res, next) {
		//remember to validate tableName req.param
			var tableObj = {tableName: req.param('tableName')};
			console.log(tableObj);
			User.update(req.session.User.id, tableObj, function userUpdated (err){
				if (err){
					return next(err);
				}

				res.redirect('/tables/');
			});
		}
};
