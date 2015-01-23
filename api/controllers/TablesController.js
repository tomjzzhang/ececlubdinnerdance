/**
 * TablesController
 *
 * @description :: Server-side logic for managing tables
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var maxTables = 32;
var maxSeats = 10;

module.exports = {

	'index': function(req, res, next) {
		var tableSeating = new Array(maxTables);
		var count = 0;
		for (i = 0; i < maxTables; i++) {
			var userObj = { tableNum: i+1};
			User.find(userObj, function foundTable (err,users){
				if (err) return next(err);
				if (!users) return next();

				if (typeof users.length !== undefined && users.length > 0){
					var tableNum = users[0].tableNum;
					var students = users.map(function extractName(item){
						var obj = {
							name: item.name,
							id: item.id
						};
						return obj;
					});

					tableSeating[tableNum-1] = JSON.parse(JSON.stringify(students));
				}

				count++;
				if (count == maxTables){
					User.findOne(req.session.User.id, function foundUser(err, user){
						if (err) return next(err);
						if (!user) return next();
						res.view({
							numTables : maxTables,
							tableSeating: tableSeating,
							userTable: user.tableNum,
							limit: maxSeats,
							layout: 'mainlayout'
						});
					});

				}

			});
		}

	},

	'addUser': function(req, res, next) {
		if (req.param('tableName') <= 0 || req.param('tableName') > maxTables){
			//TODO Bad parameter Error
			res.redirect('/tables');
			return;
		}

		var tableObj = {tableNum: req.param('tableName')};
		User.count(tableObj, function numAdmins (err, num){
			if (err) return next(err);

			var limit = maxSeats;

			if (num <= limit){
				User.update(req.session.User.id, tableObj, function userUpdated (err, user){
					if (err){
						req.session.flash={
							err: err.ValidationError
						}
						return res.redirect('/tables/index');
					}

					User.publishUpdate(req.session.User.id, {
						name: user[0].name,
						tableNum: req.param('tableName'),
					})

					res.redirect('/tables/index');
					return;
				});
			}else{
				//TODO: display table too full error
				var tableFullError = [{name: 'tableFull', message: 'The table is full!'}]
				req.session.flash = {
					err: tableFullError
				}
				return res.redirect('/tables/index');
			}


		});

	},

	'removeUser' : function(req, res, next) {
		var tableObj = {tableNum: undefined};
		User.update(req.session.User.id, tableObj, function userUpdated (err, user){
			if (err){
				return next(err);
			}
			req.session.User.tableNum = undefined;

			User.publishUpdate(req.session.User.id, {
				name: user[0].name,
				tableNum: undefined,
			})

			res.redirect('/tables/');
		});
	},

	'subscribe':function  (req, res, next) {
	    User.find(function foundUsers (err, users) {
	    	if (err) return next(err);

		    User.subscribe(req.socket, users);
		    res.send(200);
		});
	}
};
