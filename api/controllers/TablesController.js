/**
 * TablesController
 *
 * @description :: Server-side logic for managing tables
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var maxTables = 35;

module.exports = {

	'index': function(req, res, next) {
			
		var tableSeating = new Array(maxTables);
		var count = 0;
		for (i = 0; i < maxTables; i++) {
			var userObj = { tableNum: i+1};
			User.find(userObj, function foundUser (err,users){
				if (err) return next(err);
				if (!users) return next();
				
				if (typeof users.length !== undefined && users.length > 0){
					var tableNum = users[0].tableNum;
					var studentNames = users.map(function extractName(item){
						return item.name;
					});

					tableSeating[tableNum-1] = JSON.parse(JSON.stringify(studentNames));
				}

				count++;
				if (count == maxTables){	
					res.view({
						numTables : maxTables,
						tableSeating: tableSeating,
						userTable: req.session.User.tableNum
					});
				}

			});
		}

	},

	'addUser': function(req, res, next) {
	//remember to validate tableName req.param
		var tableObj = {tableNum: req.param('tableName')};
		User.update(req.session.User.id, tableObj, function userUpdated (err){
			if (err){
				return next(err);
			}
			req.session.User.tableNum = req.param('tableName');

			res.redirect('/tables/');
		});
	},

	'removeUser' : function(req, res, next) {
		var tableObj = {tableNum: undefined};
		User.update(req.session.User.id, tableObj, function userUpdated (err){
			if (err){
				return next(err);
			}
			req.session.User.tableNum = undefined;

			res.redirect('/tables/');
		});
	}
};
