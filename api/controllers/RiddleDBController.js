/**
 * RiddleDBController
 *
 * @description :: Server-side logic for managing Riddledbs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	'RiddleDB_view' : function (req,res){
		res.view();
	},

	create: function (req, res, next){

		RiddleDB.create(req.params.all(), function RiddleDBCreated (err, RiddleDB) {

			//if there's an error
			if(err)
				return next(err);

			//After successfully creating the user
			//redirect to the show action


			res.json(RiddleDB);






			} );
	}

};
